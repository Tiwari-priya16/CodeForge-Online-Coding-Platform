const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { isTokenBlocked } = require("../config/redis");

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Token is not present" });
        }

        const JWT_SECRET = process.env.JWT_KEY || 'CodeForge_JWT_Secret_Key_2026';
        const payload = jwt.verify(token, JWT_SECRET);

        const { _id } = payload;
        if (!_id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Check 0ms Blocklist
        const blocked = await isTokenBlocked(token);
        if (blocked) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        const result = await User.findById(_id).lean();
        if (!result) {
            return res.status(401).json({ message: "User Doesn't Exist" });
        }

        req.result = result;
        next();
    } catch (err) {
        res.status(401).json({ message: err.message || "Unauthorized" });
    }
};

module.exports = userMiddleware;
