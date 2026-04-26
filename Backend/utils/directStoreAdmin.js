import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../Models/User.models.js";
import { connectDB } from "../Configs/DB.configs.js";

dotenv.config();

const directStoreAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@123";

    console.log(`🚀 Starting direct database storage for: ${adminEmail}`);

    // 1. Manually hash the password here
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 2. Use the native MongoDB collection to bypass ALL Mongoose hooks/validation
    // This ensures NO double-hashing or modification happens
    const result = await User.collection.updateOne(
      { email: adminEmail },
      {
        $set: {
          name: "Super Admin",
          email: adminEmail,
          password: hashedPassword, // Store the pre-hashed password
          role: "superadmin",
          isActive: true,
          mfaEnabled: false,
          loginAttempts: 0,
          updatedAt: new Date(),
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log("✅ New Admin record CREATED directly in database.");
    } else {
      console.log("✅ Existing Admin record UPDATED directly in database.");
    }

    // 3. Verify immediately by trying a bcrypt compare
    const storedUser = await User.collection.findOne({ email: adminEmail });
    const isMatch = await bcrypt.compare(adminPassword, storedUser.password);

    if (isMatch) {
      console.log("---------------------------------");
      console.log("🏆 VERIFICATION SUCCESSFUL!");
      console.log("The password hash in the database is valid.");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log("---------------------------------");
    } else {
      console.log("❌ VERIFICATION FAILED! Something is wrong with the hashing.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during direct storage:", error.message);
    process.exit(1);
  }
};

directStoreAdmin();
