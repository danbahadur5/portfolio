import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables.");
        }

        const db = await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = db.connections[0].readyState;
        console.log("✅ Database connected");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        // Don't exit process in serverless
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};
