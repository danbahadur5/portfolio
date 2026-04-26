import cloudinary from "../Configs/cloudinary.configs.js";
import { HomeContent } from "../Models/HomeContent.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { homeContentSchema } from "../utils/validation.js";
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

export const createHomeContent = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = homeContentSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, location, position, summary, description, profile_pic, cvUrl, availableForWork } = sanitizedData;

  let profilePicUrl = profile_pic;

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "home" });
    profilePicUrl = cloud_save.secure_url;
  }

  if (!profilePicUrl && !req.file) {
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  const homeContent = await HomeContent.create({
    name,
    location,
    position,
    summary,
    description,
    profile_pic: profilePicUrl,
    cvUrl,
    availableForWork,
  });

  res.status(201).json({ 
    success: true,
    message: "Home content created successfully",
    homeContent,
  });
});

export const getHomeContent = catchAsyncErrors(async (req, res, next) => {
  const homeContent = await HomeContent.findOne().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    homeContent,
  });
});

export const updateHomeContent = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = homeContentSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, location, position, summary, description, profile_pic, cvUrl, availableForWork } = sanitizedData;

  let updateData = { name, location, position, summary, description, cvUrl, availableForWork };

  if (profile_pic) {
    updateData.profile_pic = profile_pic;
  }

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "home" });
    updateData.profile_pic = cloud_save.secure_url;
  }

  const homeContent = await HomeContent.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!homeContent) {
    return next(new ErrorHandler("Home content not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Home content updated successfully",
    homeContent,
  });
});

export const deleteHomeContent = catchAsyncErrors(async (req, res, next) => {
  const homeContent = await HomeContent.findByIdAndDelete(req.params.id);
  if (!homeContent) {
    return next(new ErrorHandler("Home content not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Home content deleted successfully",
  });
});

