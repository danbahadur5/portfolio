import mongoose from "mongoose";

const SEOTypes = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  keywords: [{ type: String }],
  ogImage: { type: String, default: "" },
  noIndex: { type: Boolean, default: false },
}, { _id: false });

const SocialLinksSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: "" },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const NavigationItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  order: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  external: { type: Boolean, default: false },
}, { _id: false });

const SiteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, "Site name is required"],
    maxlength: [100, "Site name cannot exceed 100 characters"],
    default: "Portfolio",
  },
  siteTagline: {
    type: String,
    maxlength: [200, "Tagline cannot exceed 200 characters"],
    default: "Full Stack Developer",
  },
  siteDescription: {
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  logo: { type: String, default: "" },
  favicon: { type: String, default: "" },
  ogImage: { type: String, default: "" },

  seo: {
    home: { type: SEOTypes, default: {} },
    about: { type: SEOTypes, default: {} },
    projects: { type: SEOTypes, default: {} },
    blog: { type: SEOTypes, default: {} },
    contact: { type: SEOTypes, default: {} },
  },

  socialLinks: [SocialLinksSchema],
  navigation: {
    header: [NavigationItemSchema],
    footer: [NavigationItemSchema],
  },

  contact: {
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },

  maintenance: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: "Site is under maintenance" },
    allowedIPs: [{ type: String }],
  },

  features: {
    blog: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    contactForm: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
  },

  performance: {
    cacheEnabled: { type: Boolean, default: true },
    cacheTTL: { type: Number, default: 3600 },
    imageOptimization: { type: Boolean, default: true },
    lazyLoading: { type: Boolean, default: true },
  },

  security: {
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 30 },
    passwordMinLength: { type: Number, default: 8 },
    passwordRequireUppercase: { type: Boolean, default: true },
    passwordRequireNumbers: { type: Boolean, default: true },
    passwordRequireSpecial: { type: Boolean, default: true },
    mfaEnabled: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 },
  },

  backup: {
    enabled: { type: Boolean, default: true },
    frequency: { type: String, enum: ["hourly", "daily", "weekly"], default: "daily" },
    retentionDays: { type: Number, default: 7 },
    lastBackup: { type: Date },
    storageLocation: { type: String, default: "local" },
  },

  theme: {
    primaryColor: { type: String, default: "#2563eb" },
    secondaryColor: { type: String, default: "#10b981" },
    accentColor: { type: String, default: "#f59e0b" },
    darkMode: { type: Boolean, default: true },
    customCSS: { type: String, default: "" },
  },

  analytics: {
    googleAnalytics: { type: String, default: "" },
    googleTagManager: { type: String, default: "" },
    facebookPixel: { type: String, default: "" },
  },

  email: {
    notificationsEnabled: { type: Boolean, default: true },
    contactFormTo: { type: String, default: "" },
    notificationFrom: { type: String, default: "" },
  },

  meta: {
    author: { type: String, default: "" },
    copyright: { type: String, default: "" },
    robots: { type: String, default: "index, follow" },
  },

  api: {
    publicEndpoints: [{ type: String }],
    rateLimitPublic: { type: Number, default: 100 },
    rateLimitWindow: { type: Number, default: 900000 },
  },

  versioning: {
    version: { type: String, default: "1.0.0" },
    lastUpdated: { type: Date, default: Date.now },
  },

  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "active",
  },
}, {
  timestamps: true,
  collection: "sitesettings",
});

SiteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

SiteSettingsSchema.pre("save", function (next) {
  this.versioning.lastUpdated = new Date();
  next();
});

export const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
export { SEOTypes, SocialLinksSchema, NavigationItemSchema };
