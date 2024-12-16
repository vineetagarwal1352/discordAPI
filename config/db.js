const mongoose = require('mongoose');
const logger = require("../utils/logger");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
