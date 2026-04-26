import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../Models/User.models.js";
import { connectDB } from "../Configs/DB.configs.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    // Delete existing admin to ensure fresh start with fixed hashing
    const deleted = await User.deleteOne({ email: adminEmail });
    if (deleted.deletedCount > 0) {
      console.log(`🗑️ Deleted existing user with email: ${adminEmail}`);
    }

    console.log("🛠️ Attempting to create user...");
    const admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "superadmin",
      isActive: true,
    });
    console.log("✅ User.create() finished.");

    // Verification check
    const check = await User.findOne({ email: adminEmail });
    if (check) {
      console.log(`✅ Verification: User ${check.email} (Role: ${check.role}) found in database.`);
    } else {
      console.error("❌ Verification Failed: User was not saved after creation!");
    }

    console.log("✅ Admin user created successfully!");
    console.log("---------------------------------");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log("Role: superadmin");
    console.log("---------------------------------");
    console.log("Please change your password after logging in for the first time.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
