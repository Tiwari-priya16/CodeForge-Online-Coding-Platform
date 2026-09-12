const { blockToken } = require("../config/redis");
const User = require("../models/user");
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_KEY || 'CodeForge_JWT_Secret_Key_2026';
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const COOKIE_OPTIONS = {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
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
    profilePic: user.profilePic || '',
    problemSolved: user.problemSolved || []
});

const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, lastName, username, emailId, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ emailId }, { username }] }).lean();
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';
        if (!req.body.username && emailId) {
            req.body.username = emailId.split('@')[0];
        }
    
        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: 'user' }, JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie('token', token, COOKIE_OPTIONS);
        res.status(201).json({
            user: makeUserReply(user),
            message: "Registered and Logged in Successfully"
        });
    } catch (err) {
        res.status(400).json({ message: err.message || "Registration failed" });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = await User.findOne({ emailId }).lean();
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, JWT_SECRET, { expiresIn: 60 * 60 });
        res.cookie('token', token, COOKIE_OPTIONS);
        res.status(200).json({
            user: makeUserReply(user),
            message: "Logged in Successfully"
        });
    } catch (err) {
        res.status(401).json({ message: err.message || "Invalid Credentials" });
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            const payload = jwt.decode(token);
            if (payload && payload.exp) {
                const ttl = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
                blockToken(token, ttl);
            }
        }

        res.cookie("token", null, { ...COOKIE_OPTIONS, expires: new Date(0) });
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (err) {
        res.status(200).json({ message: "Logged Out" });
    }
};

const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, JWT_SECRET, { expiresIn: 60 * 60 });

        res.cookie('token', token, COOKIE_OPTIONS);
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message || "Admin registration failed" });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateAvatar = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture URL is required" });
        }

        const userId = req.result._id;
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic }, { new: true }).lean();

        res.status(200).json({
            user: makeUserReply(updatedUser),
            message: "Profile picture updated successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating avatar: " + err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, username, bio, githubUrl, linkedinUrl, newPassword } = req.body;
        const userId = req.result._id;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (username) updateData.username = username.toLowerCase();
        if (bio !== undefined) updateData.bio = bio;
        if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;

        if (newPassword && newPassword.trim().length >= 6) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).lean();

        res.status(200).json({
            user: makeUserReply(updatedUser),
            message: "Profile updated successfully"
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile: " + err.message });
    }
};

module.exports = { register, login, logout, adminRegister, deleteProfile, updateAvatar, updateProfile, makeUserReply };
