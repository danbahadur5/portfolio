import mongoose from "mongoose";

export const connectDB = async () => {
    // Check if we have a connection and if it's ready
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // If it's connecting, wait a bit or return
    if (mongoose.connection.readyState === 2) {
        return;
    }

    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables.");
        }

        await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10, // Maintain up to 10 socket connections
        });

        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        // Do NOT call process.exit(1) in any environment when running as a serverless function
        // Throw the error so the request that triggered it fails, but the instance stays alive for next try
        throw error;
    }
};
