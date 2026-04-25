import cloudinary from "../Configs/cloudinary.configs.js";
import { About } from "../Models/About.models.js";
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

export const createAbout = catchAsyncErrors(async (req, res, next) => {
  const { name, email, title, bio, location } = req.body;

  if (!req.file) {
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  const cloud_save = await uploadImage(req.file);

  const about = await About.create({
    name,
    email,
    title,
    bio,
    location,
    profile_pic: cloud_save.secure_url,
  });

  res.status(201).json({
    success: true,
    message: "About section created successfully",
    about,
  });
});

export const getAbout = catchAsyncErrors(async (req, res, next) => {
  const about = await About.findOne().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    about,
  });
});

export const updateAbout = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, title, bio, location } = req.body;

  let updateData = { name, email, title, bio, location };

  if (req.file) {
    const cloud_save = await uploadImage(req.file);
    updateData.profile_pic = cloud_save.secure_url;
  }

  const about = await About.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!about) {
    return next(new ErrorHandler("About section not found", 404));
  }

  res.status(200).json({ 
    success: true,
    message: "About section updated successfully",
    about,
  });
});

export const deleteAbout = catchAsyncErrors(async (req, res, next) => {
  const about = await About.findByIdAndDelete(req.params.id);
  if (!about) {
    return next(new ErrorHandler("About section not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "About section deleted successfully",
  });
});
