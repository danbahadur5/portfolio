import { Message } from "../Models/Message.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";

export const createMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const newMessage = await Message.create({
    name,
    email,
    subject,
    message,
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
