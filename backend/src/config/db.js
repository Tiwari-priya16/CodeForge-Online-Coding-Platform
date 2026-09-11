const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            maxPoolSize: 50, // Keep warm pool of 50 connections for instant parallel queries
            minPoolSize: 5,  // Keep 5 persistent open sockets to MongoDB Atlas
            tlsAllowInvalidCertificates: true,
            family: 4
        });
        console.log("MongoDB Connected Successfully");

        // Safely drop invalid problemSolved_1 unique index if present in DB
        try {
            const User = require('../models/user');
            await User.collection.dropIndex('problemSolved_1');
        } catch (e) {
            // Index already dropped or doesn't exist
        }
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        console.log("Retrying MongoDB connection in 5 seconds...");
        setTimeout(main, 5000);
    }
}

module.exports = main;
