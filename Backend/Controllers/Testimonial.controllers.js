import cloudinary from "../Configs/cloudinary.configs.js";
import { Testimonial } from "../Models/Testimonial.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { testimonialSchema } from "../utils/validation.js";
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

export const createTestimonial = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = testimonialSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, role, company, content, rating, avatar, linkedinUrl, projectId } = sanitizedData;

  let avatarUrl = avatar;

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "testimonials" });
    avatarUrl = cloud_save.secure_url;
  }

  const testimonial = await Testimonial.create({
    name,
    role,
    company,
    content,
    rating: rating || 5,
    avatar: avatarUrl,
    linkedinUrl,
    projectId,
    approved: false,
  });

  res.status(201).json({
    success: true,
    testimonial,
    message: "Testimonial submitted successfully",
  });
});

export const getApprovedTestimonials = catchAsyncErrors(async (req, res, next) => {
  const { featured, limit = 10 } = req.query;

  const query = { approved: true, isActive: true };
  if (featured === "true") {
    query.featured = true;
  }

  const testimonials = await Testimonial.find(query)
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    testimonials,
  });
});

export const getAllTestimonials = catchAsyncErrors(async (req, res, next) => {
  const { approved, featured, page = 1, limit = 10 } = req.query;

  const query = {};
  if (approved !== undefined) query.approved = approved === "true";
  if (featured !== undefined) query.featured = featured === "true";

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const testimonials = await Testimonial.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Testimonial.countDocuments(query);

  res.status(200).json({
    success: true,
    testimonials,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getTestimonialById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }

  res.status(200).json({
    success: true,
    testimonial,
  });
});

export const updateTestimonial = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = testimonialSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, role, company, content, rating, avatar, linkedinUrl, featured, approved } = sanitizedData;

  let updateData = {
    name,
    role,
    company,
    content,
    rating: rating ? parseInt(rating) : undefined,
    linkedinUrl,
    featured: featured === "true" || featured === true,
    approved: approved === "true" || approved === true,
  };

  if (avatar) {
    updateData.avatar = avatar;
  }

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "testimonials" });
    updateData.avatar = cloud_save.secure_url;
  }

  const testimonial = await Testimonial.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }

  res.status(200).json({
    success: true,
    testimonial,
    message: "Testimonial updated successfully",
  });
});

export const deleteTestimonial = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndDelete(id);

  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Testimonial deleted successfully",
  });
});

export const approveTestimonial = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);
  
  // 2. Validate input
  const { approved } = sanitizedData;
  if (approved === undefined) {
    return next(new ErrorHandler("Approval status is required", 400));
  }

  const testimonial = await Testimonial.findByIdAndUpdate(
    id,
    { $set: { approved: approved === "true" || approved === true } },
    { new: true, runValidators: true }
  );

  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }

  res.status(200).json({
    success: true,
    testimonial,
    message: `Testimonial ${testimonial.approved ? "approved" : "disapproved"} successfully`,
  });
});

export const toggleFeatured = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    return next(new ErrorHandler("Testimonial not found", 404));
  }

  testimonial.featured = !testimonial.featured;
  await testimonial.save();

  res.status(200).json({
    success: true,
    testimonial,
    message: testimonial.featured ? "Testimonial featured" : "Testimonial unfeatured",
  });
});

export const reorderTestimonials = catchAsyncErrors(async (req, res, next) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return next(new ErrorHandler("orderedIds must be an array", 400));
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      Testimonial.findByIdAndUpdate(id, { order: index })
    )
  );

  const testimonials = await Testimonial.find({ approved: true, isActive: true })
    .sort({ order: 1 });

  res.status(200).json({
    success: true,
    testimonials,
    message: "Testimonials reordered successfully",
  });
});
