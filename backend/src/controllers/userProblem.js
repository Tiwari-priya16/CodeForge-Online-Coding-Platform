const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {
  const {
    title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured in reference solution testcases");
        }
      }
    }

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send("Missing ID Field");
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not present in server");
    }

    const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
    res.status(200).send(newProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) return res.status(404).send("Problem is Missing");
    res.status(200).send("Successfully Deleted");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id)
      .select('_id title description difficulty tags visibleTestCases startCode referenceSolution')
      .lean();

    if (!getProblem) return res.status(404).send("Problem is Missing");

    const videos = await SolutionVideo.findOne({ problemId: id }).lean();
    if (videos) {
      const responseData = {
        ...getProblem,
        secureUrl: videos.secureUrl,
        thumbnailUrl: videos.thumbnailUrl,
        duration: videos.duration,
      };
      return res.status(200).json(responseData);
    }
    res.status(200).json(getProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

// Optimized Fast Query (lean execution)
const getAllProblem = async (req, res) => {
  try {
    const getProblem = await Problem.find({}).select('_id title difficulty tags').lean();
    res.status(200).json(getProblem || []);
  } catch (err) {
    res.status(500).json([]);
  }
};

// Fast User Solved Query (Direct ID set match, no heavy populate)
const solvedAllProblembyUser = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).select('problemSolved').lean();

    if (!user || !user.problemSolved || user.problemSolved.length === 0) {
      return res.status(200).json([]);
    }

    const cleanSolved = await Problem.find({ _id: { $in: user.problemSolved } })
      .select('_id title difficulty tags')
      .lean();

    res.status(200).json(cleanSolved || []);
  } catch (err) {
    res.status(500).json([]);
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;
    const ans = await Submission.find({ userId, problemId }).lean();
    if (!ans || ans.length == 0) return res.status(200).json([]);
    return res.status(200).json(ans);
  } catch (err) {
    return res.status(500).json([]);
  }
};

// Calculate Consecutive Calendar Day Streak from Accepted Submissions
const calculateStreak = async (userId) => {
  try {
    const acceptedSubs = await Submission.find({ userId, status: 'accepted' })
      .select('createdAt')
      .sort({ createdAt: -1 })
      .lean();

    if (!acceptedSubs || acceptedSubs.length === 0) return { streak: 0, solvedToday: false };

    const datesSet = new Set(acceptedSubs.map(s => new Date(s.createdAt).toISOString().split('T')[0]));

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const solvedToday = datesSet.has(todayStr);

    if (!solvedToday && !datesSet.has(yesterdayStr)) {
      return { streak: 0, solvedToday: false };
    }

    let currentCheck = solvedToday ? new Date() : yesterday;
    let streak = 0;

    while (true) {
      const checkStr = currentCheck.toISOString().split('T')[0];
      if (datesSet.has(checkStr)) {
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      } else {
        break;
      }
    }

    return { streak, solvedToday };
  } catch (e) {
    return { streak: 0, solvedToday: false };
  }
};

// Real User Submissions Accuracy Logic: (Accepted Submissions / Total Submissions) * 100
const getUserStats = async (req, res) => {
  try {
    const userId = req.result._id;
    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ userId, status: 'accepted' });
    const accuracy = totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 0;

    const streakData = await calculateStreak(userId);

    res.status(200).json({
      totalSubmissions,
      acceptedSubmissions,
      accuracy,
      streak: streakData.streak,
      solvedToday: streakData.solvedToday
    });
  } catch (err) {
    res.status(500).json({ totalSubmissions: 0, acceptedSubmissions: 0, accuracy: 0, streak: 0, solvedToday: false });
  }
};

module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem, getUserStats };
