const express = require('express');

const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem,getUserStats} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");

// Admin Routes
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

// User Routes
problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);
problemRouter.get("/userStats", userMiddleware, getUserStats);

module.exports = problemRouter;
