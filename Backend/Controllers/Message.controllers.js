import { Message } from "../Models/Message.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { messageSchema } from "../utils/validation.js";
import { sanitize } from "../utils/sanitization.js";

export const createMessage = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);
  
  // 2. Validate input
  const { error } = messageSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, email, subject, message, budget, timeline } = sanitizedData;

  const newMessage = await Message.create({
    name,
    email,
    subject,
    message,
    budget,
    timeline,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    newMessage,
  });
});

export const getMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    messages,
  });
});

export const getUnreadCount = catchAsyncErrors(async (req, res, next) => {
  const count = await Message.countDocuments({ status: "unread" });
  res.status(200).json({
    success: true,
    count,
  });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});
