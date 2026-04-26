import { Skill } from "../Models/Skills.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { skillSchema } from "../utils/validation.js";
import { sanitize } from "../utils/sanitization.js";

const parseJsonIfNeeded = (data) => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data.split(",").map((s) => s.trim());
    }
  }
  return data || [];
};

export const createSkill = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = skillSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { technical, languages, frameworks, tools } = sanitizedData;

  const skill = await Skill.create({
    technical: parseJsonIfNeeded(technical),
    languages: parseJsonIfNeeded(languages),
    frameworks: parseJsonIfNeeded(frameworks),
    tools: parseJsonIfNeeded(tools),
  });

  res.status(201).json({
    success: true,
    message: "Skills added successfully",
    skill,
  });
});

export const getSkill = catchAsyncErrors(async (req, res, next) => {
  const skills = await Skill.find();
  res.status(200).json({
    success: true,
    skills,
  });
});

export const updateSkill = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = skillSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { technical, languages, frameworks, tools } = sanitizedData;

  const skill = await Skill.findByIdAndUpdate(
    id,
    {
      technical: parseJsonIfNeeded(technical),
      languages: parseJsonIfNeeded(languages),
      frameworks: parseJsonIfNeeded(frameworks),
      tools: parseJsonIfNeeded(tools),
    },
    { new: true, runValidators: true }
  );

  if (!skill) {
    return next(new ErrorHandler("Skill set not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Skills updated successfully",
    skill,
  });
});

export const deleteSkill = catchAsyncErrors(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    return next(new ErrorHandler("Skill set not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Skills deleted successfully",
  });
});
