import Joi from "joi";

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    .required(),
  role: Joi.string().valid("user", "editor", "admin", "superadmin").default("user"),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  role: Joi.string().valid("user", "editor", "admin", "superadmin"),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const projectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(2000).required(),
  liveUrl: Joi.string().uri().allow(""),
  sourceUrl: Joi.string().uri().allow(""),
  technologies: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .required(),
  category: Joi.string().max(50).default("Other"),
  featured: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(false),
  image: Joi.string().allow(""),
  order: Joi.number().default(0),
});

export const blogSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  slug: Joi.string().lowercase().max(200),
  excerpt: Joi.string().max(500).allow(""),
  content: Joi.string().min(10).required(),
  image: Joi.string().allow(""),
  featuredImage: Joi.string().allow(""),
  featuredImageCaption: Joi.string().max(200).allow(""),
  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string().max(30)), Joi.string())
    .default([]),
  category: Joi.string().max(50).default("General"),
  status: Joi.string().valid("draft", "published", "archived").default("published"),
  featured: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(false),
  allowComments: Joi.boolean().default(true),
  seo: Joi.object({
    metaTitle: Joi.string().max(60),
    metaDescription: Joi.string().max(160),
    ogImage: Joi.string().allow(""),
    noIndex: Joi.boolean().default(false),
  }).optional(),
});

export const contactSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().allow(""),
  linkedin_profile: Joi.string().uri().allow(""),
  github_profile: Joi.string().uri().allow(""),
  twitter_profile: Joi.string().uri().allow(""),
  personal_website: Joi.string().uri().allow(""),
});

export const experienceSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  company: Joi.string().min(3).max(100).required(),
  location: Joi.string().min(3).max(50).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().allow(null, "").greater(Joi.ref("start_date")),
  description: Joi.string().min(3).max(2000).required(),
  achievements: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .default([]),
  current: Joi.boolean().default(false),
});

export const skillSchema = Joi.object({
  technical: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .default([]),
  languages: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .default([]),
  frameworks: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .default([]),
  tools: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .default([]),
});

export const messageSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  subject: Joi.string().min(3).max(200).required(),
  message: Joi.string().min(10).max(5000).required(),
});

export const aboutSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  title: Joi.string().min(3).max(100).required(),
  bio: Joi.string().min(10).max(5000).required(),
  location: Joi.string().allow(""),
  profile_pic: Joi.string().allow(""),
});

export const homeContentSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  location: Joi.string().allow("").default("."),
  position: Joi.string().min(3).max(100).required(),
  summary: Joi.string().min(3).max(1000).required(),
  description: Joi.string().min(3).max(5000).required(),
  profile_pic: Joi.string().allow(""),
  cvUrl: Joi.string().uri().allow(""),
  availableForWork: Joi.boolean().default(true),
});

export const testimonialSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  role: Joi.string().max(100).allow(""),
  company: Joi.string().max(100).allow(""),
  content: Joi.string().min(10).max(1000).required(),
  rating: Joi.number().min(1).max(5).default(5),
  avatar: Joi.string().allow(""),
  linkedinUrl: Joi.string().allow(""),
  featured: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(false),
  approved: Joi.alternatives().try(Joi.boolean(), Joi.string()).default(false),
  order: Joi.number().default(0),
});

export const settingsSchema = Joi.object({
  siteName: Joi.string().max(100),
  siteTagline: Joi.string().max(200),
  siteDescription: Joi.string().max(500),
  logo: Joi.string().uri().allow(""),
  favicon: Joi.string().uri().allow(""),
  ogImage: Joi.string().uri().allow(""),
  features: Joi.object({
    blog: Joi.boolean(),
    projects: Joi.boolean(),
    contactForm: Joi.boolean(),
    testimonials: Joi.boolean(),
    analytics: Joi.boolean(),
  }),
  theme: Joi.object({
    primaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    accentColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    darkMode: Joi.boolean(),
  }),
});

export const mfaSchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d+$/),
  backupCode: Joi.string().length(8).pattern(/^[A-F0-9]+$/),
}).or("code", "backupCode");

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required(),
});
