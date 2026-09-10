const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require("../models/submission");

const JWT_SECRET = process.env.JWT_KEY || 'CodeForge_JWT_Secret_Key_2026';

const COOKIE_OPTIONS = {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
};

const makeUserReply = (user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName || '',
    emailId: user.emailId,
    username: user.username || user.emailId.split('@')[0],
    role: user.role,
    bio: user.bio || 'DSA Enthusiast & Developer',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    profilePic: user.profilePic || ''
});

const register = async (req,res)=>{
    
    try{
        // validate the data;

      validate(req.body); 
      const {firstName, lastName, username, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user';
      if (!req.body.username && emailId) {
        req.body.username = emailId.split('@')[0];
      }
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'}, JWT_SECRET, {expiresIn: 60*60});

     res.cookie('token', token, COOKIE_OPTIONS);
     res.status(201).json({
        user: makeUserReply(user),
        message:"Logged in Successfully"
    })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role}, JWT_SECRET, {expiresIn: 60*60});
        res.cookie('token', token, COOKIE_OPTIONS);
        res.status(201).json({
            user: makeUserReply(user),
            message:"Logged in Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        if (token) {
            const payload = jwt.decode(token);
            if (payload && payload.exp) {
                await redisClient.set(`token:${token}`, 'Blocked');
                await redisClient.expireAt(`token:${token}`, payload.exp);
            }
        }

        res.cookie("token", null, { expires: new Date(0), path: '/' });
        res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
      validate(req.body);
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);

     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role}, JWT_SECRET, {expiresIn: 60*60});
     res.cookie('token', token, COOKIE_OPTIONS);
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    await User.findByIdAndDelete(userId);

    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}


const updateAvatar = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).send("Profile picture URL is required");
        }

        const user = req.result;
        user.profilePic = profilePic;
        await user.save();

        res.status(200).json({
            user: makeUserReply(user),
            message: "Profile picture updated successfully"
        });
    } catch (err) {
        res.status(500).send("Error updating avatar: " + err.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, username, bio, githubUrl, linkedinUrl, newPassword } = req.body;
        const user = req.result;

        if (firstName) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (username) user.username = username.toLowerCase();
        if (bio !== undefined) user.bio = bio;
        if (githubUrl !== undefined) user.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;

        if (newPassword && newPassword.trim().length >= 6) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        res.status(200).json({
            user: makeUserReply(user),
            message: "Profile updated successfully"
        });
    } catch (err) {
        res.status(500).send("Error updating profile: " + err.message);
    }
};

module.exports = {register, login, logout, adminRegister, deleteProfile, updateAvatar, updateProfile, makeUserReply};
