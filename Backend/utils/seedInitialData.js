import mongoose from "mongoose";
import dotenv from "dotenv";
import { 
  HomeContent, 
  Skill, 
  About, 
  Contact, 
  SiteSettings 
} from "../Models/index.js";
import { connectDB } from "../Configs/DB.configs.js";

dotenv.config();

const seedInitialData = async () => {
  try {
    await connectDB();
    console.log("🚀 Starting data seeding...");

    // 1. Seed Home Content
    const homeExists = await HomeContent.findOne();
    if (!homeExists) {
      await HomeContent.create({
        title: "Building Digital Excellence",
        subtitle: "Full Stack Developer & UI/UX Enthusiast",
        description: "I craft high-performance, scalable web applications with a focus on user experience and modern architecture.",
        profile_pic: "https://res.cloudinary.com/demo/image/upload/v1631234567/sample.jpg"
      });
      console.log("✅ Home Content seeded.");
    }

    // 2. Seed Skills
    const skillsExists = await Skill.findOne();
    if (!skillsExists) {
      await Skill.create({
        technical: ["React", "Node.js", "MongoDB", "TypeScript"],
        languages: ["JavaScript", "Python", "Go"],
        frameworks: ["Tailwind CSS", "Next.js", "Express"]
      });
      console.log("✅ Skills seeded.");
    }

    // 3. Seed About
    const aboutExists = await About.findOne();
    if (!aboutExists) {
      await About.create({
        title: "About Me",
        description: "I am a passionate Full Stack Developer with over 5 years of experience in building modern web applications. I love solving complex problems and learning new technologies.",
        profile_pic: "https://res.cloudinary.com/demo/image/upload/v1631234567/sample.jpg"
      });
      console.log("✅ About Content seeded.");
    }

    // 4. Seed Contact Info
    const contactExists = await Contact.findOne();
    if (!contactExists) {
      await Contact.create({
        email: "admin@example.com",
        phone: "+1234567890",
        github_profile: "https://github.com",
        linkedin_profile: "https://linkedin.com",
        twitter_profile: "https://twitter.com",
        personal_website: "https://portfolio.com"
      });
      console.log("✅ Contact Info seeded.");
    }

    // 5. Seed Site Settings
    const settingsExists = await SiteSettings.findOne();
    if (!settingsExists) {
      await SiteSettings.create({
        siteName: "Portfolio CMS",
        siteTagline: "Full Stack Developer",
        siteDescription: "My personal portfolio powered by a custom CMS",
        socialLinks: [
          { platform: "GitHub", url: "https://github.com", enabled: true, order: 1 },
          { platform: "LinkedIn", url: "https://linkedin.com", enabled: true, order: 2 }
        ],
        navigation: [
          { label: "Home", path: "/", order: 1, enabled: true },
          { label: "Projects", path: "/projects", order: 2, enabled: true },
          { label: "Blog", path: "/blog", order: 3, enabled: true }
        ],
        features: {
          blog: true,
          projects: true,
          testimonials: true,
          contact: true,
          newsletter: false
        }
      });
      console.log("✅ Site Settings seeded.");
    }

    console.log("⭐ Initial data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
};

seedInitialData();
