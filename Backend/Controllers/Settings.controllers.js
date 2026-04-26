import { SiteSettings } from "../Models/SiteSettings.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { settingsSchema } from "../utils/validation.js";
import { sanitize } from "../utils/sanitization.js";

export const getSettings = catchAsyncErrors(async (req, res, next) => {
  const settings = await SiteSettings.getSettings();

  const safeSettings = settings.toObject();

  delete safeSettings.backup?.storageLocation;
  delete safeSettings.api?.publicEndpoints;

  res.status(200).json({
    success: true,
    settings,
  });
});

export const updateSettings = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input (optional, only validate fields that are provided)
  const { error } = settingsSchema.validate(sanitizedData, { allowUnknown: true });
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const allowedFields = [
    "siteName",
    "siteTagline",
    "siteDescription",
    "logo",
    "favicon",
    "ogImage",
    "seo",
    "socialLinks",
    "navigation",
    "contact",
    "maintenance",
    "features",
    "performance",
    "security",
    "backup",
    "theme",
    "analytics",
    "email",
    "meta",
    "api",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (sanitizedData[field] !== undefined) {
      updates[field] = sanitizedData[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No valid fields to update", 400));
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    settings,
  });
});

export const updateSEOSettings = catchAsyncErrors(async (req, res, next) => {
  const { page } = req.params;
  const seoData = req.body;

  const validPages = ["home", "about", "projects", "blog", "contact"];

  if (!validPages.includes(page)) {
    return next(new ErrorHandler(`Invalid page. Valid pages: ${validPages.join(", ")}`, 400));
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: { [`seo.${page}`]: seoData } },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "SEO settings updated successfully",
    seo: settings.seo[page],
  });
});

export const updateSocialLinks = catchAsyncErrors(async (req, res, next) => {
  const { socialLinks } = req.body;

  if (!Array.isArray(socialLinks)) {
    return next(new ErrorHandler("Social links must be an array", 400));
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: { socialLinks } },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Social links updated successfully",
    socialLinks: settings.socialLinks,
  });
});

export const updateNavigation = catchAsyncErrors(async (req, res, next) => {
  const { header, footer } = req.body;

  const updates = {};
  if (header !== undefined) updates["navigation.header"] = header;
  if (footer !== undefined) updates["navigation.footer"] = footer;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No navigation data provided", 400));
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Navigation updated successfully",
    navigation: settings.navigation,
  });
});

export const updateTheme = catchAsyncErrors(async (req, res, next) => {
  const { primaryColor, secondaryColor, accentColor, darkMode, customCSS } = req.body;

  const updates = {};
  if (primaryColor !== undefined) updates["theme.primaryColor"] = primaryColor;
  if (secondaryColor !== undefined) updates["theme.secondaryColor"] = secondaryColor;
  if (accentColor !== undefined) updates["theme.accentColor"] = accentColor;
  if (darkMode !== undefined) updates["theme.darkMode"] = darkMode;
  if (customCSS !== undefined) updates["theme.customCSS"] = customCSS;

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No theme data provided", 400));
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Theme updated successfully",
    theme: settings.theme,
  });
});

export const updateFeatures = catchAsyncErrors(async (req, res, next) => {
  const features = req.body;

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: { features } },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Features updated successfully",
    features: settings.features,
  });
});

export const toggleMaintenanceMode = catchAsyncErrors(async (req, res, next) => {
  const { enabled, message, allowedIPs } = req.body;

  const updates = { "maintenance.enabled": enabled };
  if (message !== undefined) updates["maintenance.message"] = message;
  if (allowedIPs !== undefined) updates["maintenance.allowedIPs"] = allowedIPs;

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: enabled ? "Maintenance mode enabled" : "Maintenance mode disabled",
    maintenance: settings.maintenance,
  });
});

export const updateSecuritySettings = catchAsyncErrors(async (req, res, next) => {
  const securityFields = [
    "maxLoginAttempts",
    "lockoutDuration",
    "passwordMinLength",
    "passwordRequireUppercase",
    "passwordRequireNumbers",
    "passwordRequireSpecial",
    "mfaEnabled",
    "sessionTimeout",
  ];

  const updates = {};
  for (const field of securityFields) {
    if (req.body[field] !== undefined) {
      updates[`security.${field}`] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No security settings provided", 400));
  }

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Security settings updated successfully",
    security: settings.security,
  });
});

export const updateAnalytics = catchAsyncErrors(async (req, res, next) => {
  const { googleAnalytics, googleTagManager, facebookPixel } = req.body;

  const updates = {};
  if (googleAnalytics !== undefined) updates["analytics.googleAnalytics"] = googleAnalytics;
  if (googleTagManager !== undefined) updates["analytics.googleTagManager"] = googleTagManager;
  if (facebookPixel !== undefined) updates["analytics.facebookPixel"] = facebookPixel;

  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return next(new ErrorHandler("Settings not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Analytics updated successfully",
    analytics: settings.analytics,
  });
});

export const getPublicSettings = catchAsyncErrors(async (req, res, next) => {
  const settings = await SiteSettings.getSettings();

  const publicSettings = {
    siteName: settings.siteName,
    siteTagline: settings.siteTagline,
    siteDescription: settings.siteDescription,
    logo: settings.logo,
    ogImage: settings.ogImage,
    socialLinks: settings.socialLinks.filter((s) => s.enabled),
    contact: settings.contact,
    features: settings.features,
    theme: {
      primaryColor: settings.theme.primaryColor,
      secondaryColor: settings.theme.secondaryColor,
      accentColor: settings.theme.accentColor,
      darkMode: settings.theme.darkMode,
    },
  };

  res.status(200).json({
    success: true,
    settings: publicSettings,
  });
});
