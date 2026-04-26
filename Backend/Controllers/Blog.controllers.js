import cloudinary from "../Configs/cloudinary.configs.js";
import { Blog } from "../Models/Blog.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { blogSchema } from "../utils/validation.js";
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

export const createBlog = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = blogSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { title, featured, content, tags, featuredImage } = sanitizedData;

  let imageUrl = featuredImage;

  if (req.file) {
    const savedImage = await uploadImage(req.file, {
      folder: "blogs",
    });
    imageUrl = savedImage.secure_url;
  }

  if (!imageUrl && !req.file) {
    return next(new ErrorHandler("Image is required", 400));
  }

  const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newBlog = await Blog.create({
    title,
    slug,
    featured: featured === "true" || featured === true,
    content,
    featuredImage: imageUrl,
    tags: parsedTags,
    author: req.user.id,
    status: "published",
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog: newBlog,
  });
});

export const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    blogs,
  });
});

export const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = blogSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { title, featured, content, tags, featuredImage } = sanitizedData;

  let updateData = {
    title,
    featured: featured === "true" || featured === true,
    content,
    tags: typeof tags === "string" ? JSON.parse(tags) : tags || [],
  };

  if (featuredImage) {
    updateData.featuredImage = featuredImage;
  }

  if (title) {
    updateData.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  if (req.file) {
    const savedImage = await uploadImage(req.file, {
      folder: "blogs",
    });
    updateData.featuredImage = savedImage.secure_url;
  }

  const blog = await Blog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
});

export const getBlogById = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name profile_pic");
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blog,
  });
});

export const getBlogStats = catchAsyncErrors(async (req, res, next) => {
  const stats = await Blog.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalViews: { $sum: "$viewCount" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    stats,
  });
});

export const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});
