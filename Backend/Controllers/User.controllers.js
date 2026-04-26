import cloudinary from "../Configs/cloudinary.configs.js";
import { User } from "../Models/User.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { userSignupSchema, userLoginSchema, userUpdateSchema } from "../utils/validation.js";
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

export const Createaccount = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = userSignupSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, email, password, role } = sanitizedData;

  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  if (!req.file) {
    return next(new ErrorHandler("Profile image is required", 400));
  }

  const cloud_save = await uploadImage(req.file, { folder: "users" });

  const newuser = await User.create({
    name,
    email,
    password,
    role,
    profile_pic: cloud_save.secure_url,
  });

  res.status(201).json({
    success: true,
    user: newuser,
    message: "Account created successfully",
  });
});

export const Login = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = userLoginSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { email, password } = sanitizedData;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const token = user.getJWTToken();

  const isProd = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 10 * 24 * 60 * 60 * 1000,
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  };

  res.cookie("token", token, cookieOptions);

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.__v;

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: safeUser,
  });
});

export const Logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
    maxAge: 0,
  });
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const Updateaccount = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = userUpdateSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, email, password, role } = sanitizedData;
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.name = name || user.name;
  user.email = email || user.email;
  if (password) user.password = password;
  user.role = role || user.role;

  if (req.file) {
    const cloud_save = await uploadImage(req.file, { folder: "users" });
    user.profile_pic = cloud_save.secure_url;
  }

  await user.save();
  
  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.__v;

  res.status(200).json({
    success: true,
    user: safeUser,
    message: "Account updated successfully",
  });
});

export const Getaccount = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
    message: "Account retrieved successfully",
  });
});

export const Getallaccounts = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
    message: "Accounts retrieved successfully",
  });
});

export const Deleteaccount = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id || req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

export const Deleteallaccounts = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ErrorHandler("Access denied: Admin privileges required", 403));
  }
  await User.deleteMany();
  res.status(200).json({
    success: true,
    message: "Accounts deleted successfully",
  });
});
