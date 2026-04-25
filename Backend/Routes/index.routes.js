import express from "express";
import {
  Createaccount,
  Deleteaccount,
  Deleteallaccounts,
  Getaccount,
  Getallaccounts,
  Login,
  Logout,
  Updateaccount,
} from "../Controllers/User.controllers.js";
import {
  Createproject,
  DeleteProject,
  GetAllProjects,
  GetProjectById,
  UpdateProject,
} from "../Controllers/Project.controllers.js";
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
  updateBlog,
  deleteBlog,
} from "../Controllers/Blog.controllers.js";
import { getDashboardStats } from "../Controllers/Dashboard.controllers.js";
import {
  createMessage,
  deleteMessage,
  getMessages,
} from "../Controllers/Message.controllers.js";
import { auth } from "../Middlewares/auth.middlewares.js";
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
} from "../utils/validation.js";

export const router = express.Router();
// User routes
router.post(
  "/signup",
  upload.single("profile_pic"),
  validateRequest(userSignupSchema),
  Createaccount
);
router.post("/login", validateRequest(userLoginSchema), Login);
router.get("/logout", auth, Logout);
router.get("/getuser", auth, Getaccount);
router.get("/getalluser", auth, Getallaccounts);
router.delete("/deleteuser/:id", auth, Deleteaccount);
router.put(
  "/updateuser",
  auth,
  upload.single("profile_pic"),
  Updateaccount
);
router.delete("/deleteall", auth, Deleteallaccounts);

// Project routes
router.post(
  "/createproject",
  auth,
  upload.single("image"),
  validateRequest(projectSchema),
  Createproject
);
router.get("/getallproject", GetAllProjects);
router.get("/getproject/:id", auth, GetProjectById);
router.put(
  "/updateproject/:id",
  auth,
  upload.single("image"),
  validateRequest(projectSchema),
  UpdateProject
);
router.delete("/deleteproject/:id", auth, DeleteProject);

// About routes
router.post(
  "/createabout",
  auth,
  upload.single("profile_pic"),
  validateRequest(aboutSchema),
  createAbout
);
router.get("/getabout", getAbout);
router.put(
  "/updateabout/:id",
  auth,
  upload.single("profile_pic"),
  validateRequest(aboutSchema),
  updateAbout
);
router.delete("/deleteabout/:id", auth, deleteAbout);

// HomeContent routes
router.post(
  "/createhomecontent",
  auth,
  upload.single("profile_pic"),
  validateRequest(homeContentSchema),
  createHomeContent
);
router.get("/gethomecontent", getHomeContent);
router.put(
  "/updatehomecontent/:id",
  auth,
  upload.single("profile_pic"),
  validateRequest(homeContentSchema),
  updateHomeContent
);
router.delete("/deletehomecontent/:id", auth, deleteHomeContent);

// Message routes
router.post("/sendmessage", validateRequest(messageSchema), createMessage);
router.get("/getmessages", auth, getMessages);
router.delete("/deletemessage/:id", auth, deleteMessage);

// Experience routes
router.post(
  "/createexperience",
  auth,
  validateRequest(experienceSchema),
  createExperience
);
router.get("/getexperience", getExperience);
router.put(
  "/updateexperience/:id",
  auth,
  validateRequest(experienceSchema),
  updateExperience
);
router.delete("/deleteexperience/:id", auth, deleteExperience);

// Blog routes
router.post(
  "/createblog",
  auth,
  upload.single("image"),
  validateRequest(blogSchema),
  createBlog
);
router.get("/getblogs", getAllBlogs);
router.put(
  "/updateblog/:id",
  auth,
  upload.single("image"),
  validateRequest(blogSchema),
  updateBlog
);
router.delete("/deleteblog/:id", auth, deleteBlog);

// Skill routes
router.post("/createskill", auth, validateRequest(skillSchema), createSkill);
router.get("/getskill", getSkill);
router.put("/updateskill/:id", auth, validateRequest(skillSchema), updateSkill);
router.delete("/deleteskill/:id", auth, deleteSkill);

// Contact routes
router.post("/createcontact", auth, validateRequest(contactSchema), createContact);
router.get("/getcontact", getContacts);
router.put("/updatecontact/:id", auth, validateRequest(contactSchema), updateContact);
router.delete("/deletecontact/:id", auth, deleteContact);

// Dashboard routes
router.get("/dashboard/stats", auth, getDashboardStats);

// http://localhost:3000/api/dashboard/stats
