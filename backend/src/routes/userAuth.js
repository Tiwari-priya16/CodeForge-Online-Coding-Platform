const express = require('express');

const authRouter =  express.Router();
const {register, login, logout, adminRegister, deleteProfile, updateAvatar, updateProfile, makeUserReply} = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
authRouter.post('/update-avatar', userMiddleware, updateAvatar);
authRouter.post('/update-profile', userMiddleware, updateProfile);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{

    res.status(200).json({
        user: makeUserReply(req.result),
        message: "Valid User"
    });
})
// authRouter.get('/getProfile',getProfile);


module.exports = authRouter;

// login
// logout
// GetProfile

