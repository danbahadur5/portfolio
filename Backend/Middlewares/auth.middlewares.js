import jwt from "jsonwebtoken";
import { catchAsyncErrors, ErrorHandler } from "./error.middlewares.js";
import { User, Session } from "../Models/User.models.js";
import { SiteSettings } from "../Models/SiteSettings.models.js";

export const auth = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.access_token ||
    (req.header("Authorization") && req.header("Authorization").split(" ")[1]);

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (!user.isActive) {
      return next(new ErrorHandler("Account has been deactivated", 403));
    }

    if (user.isLocked()) {
      return next(new ErrorHandler("Account is temporarily locked", 423));
    }

    const session = await Session.findOne({ token, userId: user._id });
    if (!session && process.env.ENABLE_SESSION_CHECK === "true") {
      return next(new ErrorHandler("Session expired or invalid", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token has expired", 401));
    }
    return next(new ErrorHandler("Invalid token", 401));
  }
});

export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Authentication required", 401));
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return next(new ErrorHandler(`${req.user.role} is not authorized to access this resource`, 403));
  }
  next();
});

export const isSuperAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Authentication required", 401));
  }

  if (req.user.role !== "superadmin") {
    return next(new ErrorHandler("Super admin access required", 403));
  }
  next();
});

export const isEditor = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Authentication required", 401));
  }

  const allowedRoles = ["admin", "superadmin", "editor"];
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ErrorHandler("Editor access required", 403));
  }
  next();
});

export const checkPermission = (resource, action) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    if (req.user.role === "superadmin" || req.user.role === "admin") {
      return next();
    }

    if (!req.user.hasPermission(resource, action)) {
      return next(new ErrorHandler(`Permission denied: ${action} on ${resource}`, 403));
    }

    next();
  });
};

export const validateCSRF = catchAsyncErrors(async (req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  const csrfToken = req.cookies.csrf_token ||
    req.body.csrfToken ||
    req.headers["x-csrf-token"];

  if (!csrfToken) {
    return next(new ErrorHandler("CSRF token is missing", 403));
  }

  next();
});

export const rateLimitByUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const settings = await SiteSettings.getSettings();
  const userRateLimit = settings.security.maxLoginAttempts || 100;

  req.rateLimit = {
    windowMs: 15 * 60 * 1000,
    max: userRateLimit * 10,
  };

  next();
});

export const requireRole = (...roles) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Required role: ${roles.join(" or ")}`, 403));
    }

    next();
  });
};

export const auditLog = catchAsyncErrors(async (req, res, next) => {
  req.actionLog = {
    userId: req.user?._id,
    action: req.method,
    endpoint: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    timestamp: new Date(),
    body: req.method !== "GET" ? { ...req.body } : undefined,
  };
  next();
});
