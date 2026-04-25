import Joi from 'joi';

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const projectSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
  liveUrl: Joi.string().uri().allow(''),
  sourceUrl: Joi.string().uri().allow(''),
  technologies: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).required(),
  category: Joi.string().default('Other'),
  featured: Joi.boolean().default(false),
});

export const blogSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  featured: Joi.boolean().default(false),
  tags: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).default([]),
});

export const contactSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().allow(''),
  linkedin_profile: Joi.string().uri().allow(''),
  github_profile: Joi.string().uri().allow(''),
  twitter_profile: Joi.string().uri().allow(''),
  personal_website: Joi.string().uri().allow(''),
});

export const experienceSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  company: Joi.string().min(3).max(100).required(),
  location: Joi.string().min(3).max(50).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().allow(null),
  description: Joi.string().min(3).max(2000).required(),
  achievements: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).default([]),
});

export const skillSchema = Joi.object({
  technical: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).default([]),
  languages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).default([]),
  frameworks: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).default([]),
});

export const messageSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
});

export const aboutSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  title: Joi.string().min(3).max(100).required(),
  bio: Joi.string().min(10).max(5000).required(),
  location: Joi.string().allow(''),
});

export const homeContentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  location: Joi.string().default('.'),
  position: Joi.string().min(3).max(100).required(),
  summary: Joi.string().min(3).max(1000).required(),
  description: Joi.string().min(3).max(5000).required(),
});
