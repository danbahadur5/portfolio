import cloudinary from "../Configs/cloudinary.configs.js";
import { Blog } from "../Models/Blog.models.js";
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

export const createBlog = catchAsyncErrors(async (req, res, next) => {
  const { title, featured, content, tags } = req.body;
  if (!req.file) {
    return next(new ErrorHandler("Image is required", 400));
  }

  const savedImage = await uploadImage(req.file, {
    folder: "blogs",
  });

  const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];

  const newBlog = await Blog.create({
    title,
    featured: featured === "true" || featured === true,
    content,
    image: savedImage.secure_url,
    tags: parsedTags,
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
  const { title, featured, content, tags } = req.body;

  let updateData = {
    title,
    featured: featured === "true" || featured === true,
    content,
    tags: typeof tags === "string" ? JSON.parse(tags) : tags || [],
  };

  if (req.file) {
    const savedImage = await uploadImage(req.file, {
      folder: "blogs",
    });
    updateData.image = savedImage.secure_url;
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
