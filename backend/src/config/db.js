const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            tlsAllowInvalidCertificates: true,
            family: 4
        });
        console.log("MongoDB Connected Successfully");

        // Safely drop invalid problemSolved_1 unique index if present in DB
        try {
            const User = require('../models/user');
            await User.collection.dropIndex('problemSolved_1');
            console.log("Dropped legacy problemSolved_1 index successfully.");
        } catch (e) {
            // Index already dropped or doesn't exist - harmless
        }
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        console.log("Retrying MongoDB connection in 5 seconds...");
        setTimeout(main, 5000);
    }
}

module.exports = main;
