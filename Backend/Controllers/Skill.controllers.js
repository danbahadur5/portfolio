import { Skill } from "../Models/Skills.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";

const parseJsonIfNeeded = (data) => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data.split(",").map(s => s.trim());
    }
  }
  return data || [];
};

export const createSkill = catchAsyncErrors(async (req, res, next) => {
  const { technical, languages, frameworks } = req.body;

  const skill = await Skill.create({
    technical: parseJsonIfNeeded(technical),
    languages: parseJsonIfNeeded(languages),
    frameworks: parseJsonIfNeeded(frameworks),
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
  const { technical, languages, frameworks } = req.body;

  const skill = await Skill.findByIdAndUpdate(
    id,
    {
      technical: parseJsonIfNeeded(technical),
      languages: parseJsonIfNeeded(languages),
      frameworks: parseJsonIfNeeded(frameworks),
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
