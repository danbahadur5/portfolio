import { Project } from "../Models/Project.models.js";
import { Blog } from "../Models/Blog.models.js";
import { Skill } from "../Models/Skills.models.js";
import { Experience } from "../Models/experience.models.js";
import { About } from "../Models/About.models.js";
import { Contact } from "../Models/Contact.models.js";
import { catchAsyncErrors } from "../Middlewares/error.middlewares.js";

export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  const [projects, blogs, skills, experiences, about, contact] =
    await Promise.all([
      Project.find(),
      Blog.find(),
      Skill.find(),
      Experience.find(),
      About.findOne(),
      Contact.findOne(),
    ]);

  const totalProjects = projects.length;
  const featuredBlogs = blogs.filter((blog) => blog.featured).length;
  const totalBlogs = blogs.length;
  const totalSkills = skills.reduce(
    (acc, skill) =>
      acc +
      (skill.technical?.length || 0) +
      (skill.languages?.length || 0) +
      (skill.frameworks?.length || 0),
    0
  );
  const totalExperience = experiences.length;

  const completionPercentage = () => {
    let completed = 0;
    const totalFields = 8;

    if (about?.name) completed++;
    if (about?.bio) completed++;
    if (about?.profile_pic) completed++;
    if (projects.length > 0) completed++;
    if (totalSkills > 0) completed++;
    if (experiences.length > 0) completed++;
    if (contact?.email) completed++;
    if (blogs.length > 0) completed++;

    return Math.round((completed / totalFields) * 100);
  };

  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 2);

  const recentBlogs = blogs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalProjects,
        featuredBlogs,
        totalBlogs,
        totalSkills,
        totalExperience,
        completionPercentage: completionPercentage(),
      },
      recentProjects: recentProjects.map((project) => ({
        id: project._id,
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        image: project.image,
        category: project.category,
        featured: project.featured,
      })),
      recentBlogs: recentBlogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        content: blog.content
          ? blog.content.substring(0, 150) + "..."
          : "No content available",
        tags: blog.tags || [],
        featured: blog.featured || false,
        createdAt: blog.createdAt,
      })),
    },
  });
});
