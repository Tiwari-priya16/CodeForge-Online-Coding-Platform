const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")

const createProblem = async (req,res)=>{
   
  // API request to authenticate user:
    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;


    try{
       
      for(const {language,completeCode} of referenceSolution){
        const languageId = getLanguageById(language);
          
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value)=> value.token);
        const testResult = await submitToken(resultToken);

        for(const test of testResult){
          if(test.status_id!=3){
            return res.status(400).send("Error Occured");
          }
        }
      }

      const userProblem = await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const updateProblem = async (req,res)=>{
  const {id} = req.params;
  try{
    if(!id){
      return res.status(400).send("Missing ID Field");
    }

    const DsaProblem = await Problem.findById(id);
    if(!DsaProblem) {
      return res.status(404).send("ID is not present in server");
    }

    const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
    res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

const deleteProblem = async(req,res)=>{
  const {id} = req.params;
  try{
    if(!id) return res.status(400).send("ID is Missing");
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if(!deletedProblem) return res.status(404).send("Problem is Missing");
    res.status(200).send("Successfully Deleted");
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getProblemById = async(req,res)=>{
  const {id} = req.params;
  try{
    if(!id) return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');
    if(!getProblem) return res.status(404).send("Problem is Missing");

    const videos = await SolutionVideo.findOne({problemId:id});
    if(videos){
      const responseData = {
        ...getProblem.toObject(),
        secureUrl:videos.secureUrl,
        thumbnailUrl : videos.thumbnailUrl,
        duration : videos.duration,
      }
      return res.status(200).send(responseData);
    }
    res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem = async(req,res)=>{
  try{
    const getProblem = await Problem.find({}).select('_id title difficulty tags');
    if(getProblem.length==0) return res.status(404).send("Problem is Missing");
    res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const solvedAllProblembyUser = async(req,res)=>{
  try{
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path:"problemSolved",
      select:"_id title difficulty tags"
    });

    const cleanSolved = (user.problemSolved || []).filter(p => p !== null);
    res.status(200).send(cleanSolved);
  }
  catch(err){
    res.status(500).send("Server Error");
  }
}

const submittedProblem = async(req,res)=>{
  try{
    const userId = req.result._id;
    const problemId = req.params.pid;
    const ans = await Submission.find({userId,problemId});
    if(ans.length==0) return res.status(200).send([]);
    return res.status(200).send(ans);
  }
  catch(err){
    return res.status(500).send("Internal Server Error");
  }
}

const getUserStats = async (req, res) => {
  try {
    const userId = req.result._id;
    const totalSubmissions = await Submission.countDocuments({ userId });
    const acceptedSubmissions = await Submission.countDocuments({ userId, status: 'accepted' });
    const accuracy = totalSubmissions > 0
      ? Math.round((acceptedSubmissions / totalSubmissions) * 100)
      : 100;

    res.status(200).json({
      totalSubmissions,
      acceptedSubmissions,
      accuracy
    });
  } catch (err) {
    res.status(500).json({ totalSubmissions: 0, acceptedSubmissions: 0, accuracy: 100 });
  }
};

module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem,getUserStats};
