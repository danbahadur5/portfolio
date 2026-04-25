import { Experience } from "../Models/experience.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";

export const createExperience = catchAsyncErrors(async (req, res, next) => {
  const { title, company, location, start_date, end_date, description, achievements } = req.body;

  const experience = await Experience.create({
    title,
    company,
    location,
    start_date,
    end_date,
    description,
    achievements: typeof achievements === "string" ? JSON.parse(achievements) : achievements || [],
  });

  res.status(201).json({
    success: true,
    message: "Experience added successfully",
    experience,
  });
});

export const getExperience = catchAsyncErrors(async (req, res, next) => {
  const experiences = await Experience.find().sort({ start_date: -1 });
  res.status(200).json({
    success: true,
    experiences,
  });
});

export const updateExperience = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, company, location, start_date, end_date, description, achievements } = req.body;

  const experience = await Experience.findByIdAndUpdate(
    id,
    {
      title,
      company,
      location,
      start_date,
      end_date,
      description,
      achievements: typeof achievements === "string" ? JSON.parse(achievements) : achievements || [],
    },
    { new: true, runValidators: true }
  );

  if (!experience) {
    return next(new ErrorHandler("Experience not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Experience updated successfully",
    experience,
  });
});

export const deleteExperience = catchAsyncErrors(async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) {
    return next(new ErrorHandler("Experience not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Experience deleted successfully",
  });
});
