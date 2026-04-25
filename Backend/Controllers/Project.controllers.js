import { Project } from "../Models/Project.models.js";
import cloudinary from "../Configs/cloudinary.configs.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";

const uploadImage = async (file, options = {}) => {
  if (!file) throw new Error("No file provided");
  if (file.path) {
    return await cloudinary.uploader.upload(file.path, options);
  }
  if (file.buffer) {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(file.buffer);
    });
  }
  throw new Error("Unsupported file input");
};

export const Createproject = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    liveUrl,
    sourceUrl,
    technologies,
    category,
    featured,
  } = req.body;

  if (!req.file) {
    return next(new ErrorHandler("Feature image is required", 400));
  }

  const cloud_save = await uploadImage(req.file);

  const project = await Project.create({
    title,
    description,
    technologies: typeof technologies === "string" ? JSON.parse(technologies) : technologies,
    liveUrl,
    sourceUrl,
    image: cloud_save.secure_url,
    category: category || "Other",
    featured: featured === "true" || featured === true,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    project,
    message: "Project created successfully",
  });
});

export const UpdateProject = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const {
    title,
    description,
    technologies,
    liveUrl,
    sourceUrl,
    category,
    featured,
  } = req.body;

  let updateData = {
    title,
    description,
    technologies: typeof technologies === "string" ? JSON.parse(technologies) : technologies,
    liveUrl,
    sourceUrl,
    category: category || "Other",
    featured: featured === "true" || featured === true,
  };

  if (req.file) {
    const cloud_save = await uploadImage(req.file);
    updateData.image = cloud_save.secure_url;
  }

  const project = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }

  res.status(200).json({
    success: true,
    project,
    message: "Project updated successfully",
  });
});

export const GetAllProjects = catchAsyncErrors(async (req, res, next) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    projects,
  });
});

export const GetProjectById = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});

export const DeleteProject = catchAsyncErrors(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return next(new ErrorHandler("Project not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});
