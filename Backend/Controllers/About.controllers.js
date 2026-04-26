import cloudinary from "../Configs/cloudinary.configs.js";
import { About } from "../Models/About.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { aboutSchema } from "../utils/validation.js";
import { sanitize } from "../utils/sanitization.js";

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
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = aboutSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, email, title, bio, location, profile_pic } = sanitizedData;

  let profilePicUrl = profile_pic;

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "about" });
    profilePicUrl = cloud_save.secure_url;
  }

  if (!profilePicUrl && !req.file) {
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  const about = await About.create({
    name,
    email,
    title,
    bio,
    location,
    profile_pic: profilePicUrl,
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

  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = aboutSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, email, title, bio, location, profile_pic } = sanitizedData;

  let updateData = { name, email, title, bio, location };

  if (profile_pic) {
    updateData.profile_pic = profile_pic;
  }

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "about" });
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
