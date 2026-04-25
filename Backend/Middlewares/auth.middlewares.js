import jwt from "jsonwebtoken";
import { catchAsyncErrors, ErrorHandler } from "./error.middlewares.js";
import { User } from "../Models/User.models.js";

export const auth = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token || (req.header("Authorization") && req.header("Authorization").split(" ")[1]);

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler(`${req.user.role} is not authorized to access this resource`, 403));
  }
  next();
});