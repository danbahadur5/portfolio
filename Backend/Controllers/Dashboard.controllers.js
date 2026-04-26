import { Project } from "../Models/Project.models.js";
import { Blog } from "../Models/Blog.models.js";
import { Skill } from "../Models/Skills.models.js";
import { Experience } from "../Models/experience.models.js";
import { About } from "../Models/About.models.js";
import { Contact } from "../Models/Contact.models.js";
import { Message } from "../Models/Message.models.js";
import { Testimonial } from "../Models/Testimonial.models.js";
import { User } from "../Models/User.models.js";
import { catchAsyncErrors } from "../Middlewares/error.middlewares.js";

export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  const [
    totalProjects,
    totalBlogs,
    totalMessages,
    totalUsers,
    totalTestimonials,
    recentMessages,
    recentBlogs,
    skills,
    experiences,
    about,
    contact,
  ] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Message.countDocuments(),
    User.countDocuments(),
    Testimonial.countDocuments({ approved: true }),
    Message.find().sort({ createdAt: -1 }).limit(5),
    Blog.find().sort({ createdAt: -1 }).limit(5),
    Skill.find(),
    Experience.find(),
    About.findOne(),
    Contact.findOne(),
  ]);

  const unreadMessages = await Message.countDocuments({ read: false });

  const blogStats = await Blog.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: null, totalViews: { $sum: "$viewCount" } } },
  ]);

  const totalSkills = skills.reduce(
    (acc, skill) =>
      acc +
      (skill.technical?.length || 0) +
      (skill.languages?.length || 0) +
      (skill.frameworks?.length || 0) +
      (skill.tools?.length || 0),
    0
  );

  const completionPercentage = () => {
    let completed = 0;
    const totalFields = 8;

    if (about?.name) completed++;
    if (about?.bio) completed++;
    if (about?.profile_pic) completed++;
    if (totalProjects > 0) completed++;
    if (totalSkills > 0) completed++;
    if (experiences.length > 0) completed++;
    if (contact?.email) completed++;
    if (totalBlogs > 0) completed++;

    return Math.round((completed / totalFields) * 100);
  };

  res.status(200).json({
    success: true,
    overview: {
      totalProjects,
      totalBlogs,
      totalMessages,
      unreadMessages,
      totalUsers,
      totalTestimonials,
      totalViews: blogStats[0]?.totalViews || 0,
      totalSkills,
      totalExperience: experiences.length,
      completionPercentage: completionPercentage(),
    },
    recentMessages,
    recentBlogs: recentBlogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      status: blog.status,
      viewCount: blog.viewCount,
      createdAt: blog.createdAt,
      tags: blog.tags || [],
      featured: blog.featured || false,
    })),
  });
});
