import express from "express";
import { User } from "../Models/User.models.js";
import {
  register,
  login,
  logout,
  verifyMFA,
  enableMFA,
  disableMFA,
  refreshAccessToken,
  logoutAllDevices,
  changePassword,
  forgotPassword,
  resetPassword,
  getCSRFToken,
  validateToken,
} from "../Controllers/Auth.controllers.js";
import {
  Createproject,
  DeleteProject,
  GetAllProjects,
  GetProjectById,
  UpdateProject,
} from "../Controllers/Project.controllers.js";
import {
  Blog,
  Project,
  Message,
  Testimonial,
  Skill,
  Experience,
  About,
} from "../Models/index.js";
import { upload } from "../Configs/Multer.config.js";

import {
  createAbout,
  deleteAbout,
  getAbout,
  updateAbout,
} from "../Controllers/About.controllers.js";
import {
  createHomeContent,
  deleteHomeContent,
  getHomeContent,
  updateHomeContent,
} from "../Controllers/HomeContent.controllers.js";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../Controllers/contact.controllers.js";
import {
  createSkill,
  deleteSkill,
  getSkill,
  updateSkill,
} from "../Controllers/Skill.controllers.js";
import {
  createExperience,
  deleteExperience,
  getExperience,
  updateExperience,
} from "../Controllers/Experience.controllers.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogStats,
} from "../Controllers/Blog.controllers.js";
import { getDashboardStats } from "../Controllers/Dashboard.controllers.js";
import {
  createMessage,
  deleteMessage,
  getMessages,
  getUnreadCount,
} from "../Controllers/Message.controllers.js";
import {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  toggleFeatured,
  reorderTestimonials,
} from "../Controllers/Testimonial.controllers.js";
import {
  getSettings,
  updateSettings,
  updateSEOSettings,
  updateSocialLinks,
  updateNavigation,
  updateTheme,
  updateFeatures,
  toggleMaintenanceMode,
  updateSecuritySettings,
  updateAnalytics,
  getPublicSettings,
} from "../Controllers/Settings.controllers.js";
import { ErrorHandler } from "../Middlewares/error.middlewares.js";
import { auth, isAdmin, isSuperAdmin, isEditor, validateCSRF } from "../Middlewares/auth.middlewares.js";
import { validateRequest } from "../Middlewares/validation.middlewares.js";
import {
  userSignupSchema,
  userLoginSchema,
  projectSchema,
  blogSchema,
  contactSchema,
  experienceSchema,
  skillSchema,
  messageSchema,
  aboutSchema,
  homeContentSchema,
  testimonialSchema,
} from "../utils/validation.js";

export const router = express.Router();

router.get("/csrf-token", getCSRFToken);
router.get("/validate-token", auth, validateToken);
router.get("/public-settings", getPublicSettings);

router.post("/auth/register", validateRequest(userSignupSchema), register);
router.post("/auth/login", validateRequest(userLoginSchema), login);
router.post("/auth/verify-mfa", verifyMFA);
router.post("/auth/refresh-token", refreshAccessToken);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/change-password", auth, validateCSRF, changePassword);

router.get("/auth/logout", auth, logout);
router.post("/auth/logout-all", auth, validateCSRF, logoutAllDevices);
router.get("/auth/mfa/enable", auth, enableMFA);
router.post("/auth/mfa/disable", auth, validateCSRF, disableMFA);

router.get("/admin/stats", auth, isAdmin, getDashboardStats);

router.get("/admin/users", auth, isAdmin, async (req, res, next) => {
  const { page = 1, limit = 10, role } = req.query;
  const query = {};
  if (role) query.role = role;

  const users = await User.find(query)
    .select("-password -mfaSecret -mfaBackupCodes -refreshTokens")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    users,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
  });
});

router.put("/admin/users/:id/role", auth, isSuperAdmin, async (req, res, next) => {
  const { role } = req.body;
  const validRoles = ["user", "editor", "admin", "superadmin"];

  if (!validRoles.includes(role)) {
    return next(new ErrorHandler("Invalid role", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { role } },
    { new: true }
  ).select("-password -mfaSecret -mfaBackupCodes");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.json({ success: true, user, message: "Role updated successfully" });
});

router.put("/admin/users/:id/status", auth, isAdmin, async (req, res, next) => {
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { isActive } },
    { new: true }
  ).select("-password -mfaSecret -mfaBackupCodes");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.json({ success: true, user, message: "User status updated successfully" });
});

router.delete("/admin/users/:id", auth, isSuperAdmin, async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.json({ success: true, message: "User deleted successfully" });
});

router.put("/profile", auth, validateCSRF, upload.single("profile_pic"), async (req, res, next) => {
  const { name, email, password } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (email) updates.email = email.toLowerCase();
  if (password) updates.password = password;

  if (req.file) {
    const { cloudinary } = await import("../Configs/cloudinary.configs.js");
    const result = await cloudinary.uploader.upload(req.file.path);
    updates.profile_pic = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  ).select("-password -mfaSecret -mfaBackupCodes");

  res.json({ success: true, user, message: "Profile updated successfully" });
});

router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -mfaSecret -mfaBackupCodes -refreshTokens -passwordHistory");

  res.json({ success: true, user });
});

router.put("/settings", auth, isAdmin, validateCSRF, updateSettings);
router.get("/settings", auth, isAdmin, getSettings);

router.put("/settings/seo/:page", auth, isAdmin, validateCSRF, updateSEOSettings);
router.put("/settings/social-links", auth, isAdmin, validateCSRF, updateSocialLinks);
router.put("/settings/navigation", auth, isAdmin, validateCSRF, updateNavigation);
router.put("/settings/theme", auth, isAdmin, validateCSRF, updateTheme);
router.put("/settings/features", auth, isAdmin, validateCSRF, updateFeatures);
router.put("/settings/maintenance", auth, isSuperAdmin, validateCSRF, toggleMaintenanceMode);
router.put("/settings/security", auth, isSuperAdmin, validateCSRF, updateSecuritySettings);
router.put("/settings/analytics", auth, isAdmin, validateCSRF, updateAnalytics);

router.post(
  "/projects",
  auth,
  validateCSRF,
  upload.single("image"),
  validateRequest(projectSchema),
  Createproject
);
router.get("/projects", GetAllProjects);
router.get("/projects/:id", GetProjectById);
router.put(
  "/projects/:id",
  auth,
  validateCSRF,
  upload.single("image"),
  validateRequest(projectSchema),
  UpdateProject
);
router.delete("/projects/:id", auth, validateCSRF, DeleteProject);

router.get("/about", getAbout);
router.post(
  "/about",
  auth,
  validateCSRF,
  upload.single("profile_pic"),
  validateRequest(aboutSchema),
  createAbout
);
router.put(
  "/about/:id",
  auth,
  validateCSRF,
  upload.single("profile_pic"),
  validateRequest(aboutSchema),
  updateAbout
);
router.delete("/about/:id", auth, validateCSRF, deleteAbout);

router.get("/gethomecontent", getHomeContent);
router.get("/getskill", getSkill);
router.get("/getexperience", getExperience);
router.get("/getblogs", getAllBlogs);
router.get("/getcontact", getContacts);
router.get("/getallproject", GetAllProjects);
router.get("/getabout", getAbout);

router.get("/homecontent", getHomeContent);
router.post(
  "/homecontent",
  auth,
  validateCSRF,
  upload.single("profile_pic"),
  validateRequest(homeContentSchema),
  createHomeContent
);
router.put(
  "/homecontent/:id",
  auth,
  validateCSRF,
  upload.single("profile_pic"),
  validateRequest(homeContentSchema),
  updateHomeContent
);
router.delete("/homecontent/:id", auth, validateCSRF, deleteHomeContent);

router.get("/messages", auth, getMessages);
router.get("/messages/unread-count", auth, getUnreadCount);
router.post("/messages", validateRequest(messageSchema), createMessage);
router.delete("/messages/:id", auth, validateCSRF, deleteMessage);

router.get("/experience", getExperience);
router.post(
  "/experience",
  auth,
  validateCSRF,
  validateRequest(experienceSchema),
  createExperience
);
router.put(
  "/experience/:id",
  auth,
  validateCSRF,
  validateRequest(experienceSchema),
  updateExperience
);
router.delete("/experience/:id", auth, validateCSRF, deleteExperience);

router.get("/blogs", getAllBlogs);
router.get("/blogs/stats", auth, isEditor, getBlogStats);
router.get("/blogs/:id", getBlogById);
router.post(
  "/blogs",
  auth,
  validateCSRF,
  upload.single("image"),
  validateRequest(blogSchema),
  createBlog
);
router.put(
  "/blogs/:id",
  auth,
  validateCSRF,
  upload.single("image"),
  validateRequest(blogSchema),
  updateBlog
);
router.delete("/blogs/:id", auth, validateCSRF, deleteBlog);

router.get("/skills", getSkill);
router.post("/skills", auth, validateCSRF, validateRequest(skillSchema), createSkill);
router.put("/skills/:id", auth, validateCSRF, validateRequest(skillSchema), updateSkill);
router.delete("/skills/:id", auth, validateCSRF, deleteSkill);

router.get("/contact", getContacts);
router.post("/contact", validateRequest(contactSchema), createContact);
router.put("/contact/:id", auth, validateCSRF, validateRequest(contactSchema), updateContact);
router.delete("/contact/:id", auth, validateCSRF, deleteContact);

router.get("/testimonials", getApprovedTestimonials);
router.get("/testimonials/all", auth, isEditor, getAllTestimonials);
router.get("/testimonials/:id", auth, isEditor, getTestimonialById);
router.post(
  "/testimonials",
  upload.single("avatar"),
  validateRequest(testimonialSchema),
  createTestimonial
);
router.put(
  "/testimonials/:id",
  auth,
  isEditor,
  validateCSRF,
  upload.single("avatar"),
  updateTestimonial
);
router.delete("/testimonials/:id", auth, isAdmin, validateCSRF, deleteTestimonial);
router.put("/testimonials/:id/approve", auth, isEditor, validateCSRF, approveTestimonial);
router.put("/testimonials/:id/featured", auth, isEditor, validateCSRF, toggleFeatured);
router.put("/testimonials/reorder", auth, isEditor, validateCSRF, reorderTestimonials);

router.get("/dashboard/overview", auth, isAdmin, getDashboardStats);
