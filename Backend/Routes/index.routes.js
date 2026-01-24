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
import { auth } from "../Middlewares/auth.middlewares.js";

export const router = express.Router();
// User routes
router.post("/signup", upload.single("profile_pic"), Createaccount);
router.post("/login", Login);
router.get("/logout", auth, Logout);
router.get("/getuser", auth, Getaccount);
router.get("/getalluser", auth, Getallaccounts);
router.delete("/deleteuser/:id", auth, Deleteaccount);
router.put("/updateuser", auth, upload.single("profile_pic"), Updateaccount);
router.delete("/deleteall", auth, Deleteallaccounts);

// http://localhost:3000/api/singup
// http://localhost:3000/api/login
// http://localhost:3000/api/logout
// http://localhost:3000/api/getuser
// http://localhost:3000/api/getalluser
// http://localhost:3000/api/deleteuser/:id
// http://localhost:3000/api/updateuser/:id
// http://localhost:3000/api/deleteall

// Project routes
router.post("/createproject", auth, upload.single("image"), Createproject);
router.get("/getallproject", GetAllProjects);
router.get("/getproject/:id", auth, GetProjectById);
router.put("/updateproject/:id", auth, upload.single("image"), UpdateProject);
router.delete("/deleteproject/:id", auth, DeleteProject);

// http://localhost:3000/api/createproject
// http://localhost:3000/api/getallproject
// http://localhost:3000/api/getproject/:id
// http://localhost:3000/api/updateproject/:id
// http://localhost:3000/api/deleteproject/:id

// About routes
router.post("/createabout", auth, upload.single("profile_pic"), createAbout);
router.get("/getabout", getAbout);
router.put("/updateabout/:id", auth, upload.single("profile_pic"), updateAbout);
router.delete("/deleteabout/:id", auth, deleteAbout);

// http://localhost:3000/api/createabout
// http://localhost:3000/api/getabout
import {
  createMessage,
  deleteMessage,
  getMessages,
} from "../Controllers/Message.controllers.js";

// ... existing imports ...

// Message routes
router.post("/sendmessage", createMessage);
router.get("/getmessages", auth, getMessages);
router.delete("/deletemessage/:id", auth, deleteMessage);

// http://localhost:3000/api/sendmessage
// http://localhost:3000/api/getmessages
// http://localhost:3000/api/deletemessage/:id
// http://localhost:3000/api/deleteabout/:id

// HomeContent routes
router.post(
  "/createhomecontent",
  auth,
  upload.single("profile_pic"),
  createHomeContent
);
router.get("/gethomecontent", getHomeContent);
router.put(
  "/updatehomecontent/:id",
  auth,
  upload.single("profile_pic"),
  updateHomeContent
);
router.delete("/deletehomecontent/:id", auth, deleteHomeContent);

// http://localhost:3000/api/createhomecontent
// http://localhost:3000/api/gethomecontent
// http://localhost:3000/api/updatehomecontent/:id
// http://localhost:3000/api/deletehomecontent/:id

// Contact routes
router.post("/createcontact", auth, createContact);
router.get("/getcontact", getContacts);
router.put("/updatecontact/:id", auth, updateContact);
router.delete("/deletecontact/:id", auth, deleteContact);

// http://localhost:3000/api/createcontact
// http://localhost:3000/api/getcontact
// http://localhost:3000/api/updatecontact/:id
// http://localhost:3000/api/deletecontact/:id

// Skill routes
router.post("/createskill", auth, createSkill);
router.get("/getskill", getSkill);
router.put("/updateskill/:id", auth, updateSkill);
router.delete("/deleteskill/:id", auth, deleteSkill);

// http://localhost:3000/api/createskill
// http://localhost:3000/api/getskill
// http://localhost:3000/api/updateskill/:id
// http://localhost:3000/api/deleteskill/:id

// Experience routes
router.post("/createexperience", auth, createExperience);
router.get("/getexperience", getExperience);
router.put("/updateexperience/:id", auth, updateExperience);
router.delete("/deleteexperience/:id", auth, deleteExperience);

// http://localhost:3000/api/createexperience
// http://localhost:3000/api/getexperience
// http://localhost:3000/api/updateexperience/:id
// http://localhost:3000/api/deleteexperience/:id

// Blog routes
router.post("/createblog", auth, upload.single("image"), createBlog);
router.get("/getblogs", getAllBlogs);
router.put("/updateblog/:id", auth, upload.single("image"), updateBlog);
router.delete("/deleteblog/:id", auth, deleteBlog);

// http://localhost:3000/api/createblog
// http://localhost:3000/api/getblogs
// http://localhost:3000/api/updateblog/:id
// http://localhost:3000/api/deleteblog/:id

// Dashboard routes
router.get("/dashboard/stats", auth, getDashboardStats);

// http://localhost:3000/api/dashboard/stats
