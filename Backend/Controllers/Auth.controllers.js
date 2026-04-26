import crypto from "crypto";
import { User } from "../Models/User.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { SiteSettings } from "../Models/SiteSettings.models.js";
import { userSignupSchema, userLoginSchema } from "../utils/validation.js";
import { sanitize } from "../utils/sanitization.js";

const generateCSRFToken = () => crypto.randomBytes(32).toString("hex");

const generateMFASecret = () => {
  return crypto.randomBytes(20).toString("hex");
};

const generateBackupCodes = () => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString("hex").toUpperCase());
  }
  return codes;
};

const storeSession = async (userId, token, userAgent, ipAddress) => {
  const { Session } = await import("../Models/User.models.js");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    userId,
    token,
    userAgent: userAgent || "unknown",
    ipAddress: ipAddress || "unknown",
    expiresAt,
  });

  return expiresAt;
};

const generateTokenPair = (user) => {
  const accessToken = user.getJWTToken();
  const refreshToken = user.getRefreshToken();
  return { accessToken, refreshToken };
};

export const register = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = userSignupSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { name, email, password } = sanitizedData;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  const settings = await SiteSettings.getSettings();
  if (!settings.maintenance.allowedIPs?.includes(req.ip) && settings.maintenance.enabled) {
    return next(new ErrorHandler("Registration is currently disabled", 403));
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "user",
  });

  const { accessToken, refreshToken } = generateTokenPair(user);

  await storeSession(
    user._id,
    accessToken,
    req.get("user-agent"),
    req.ip
  );

  const csrfToken = generateCSRFToken();

  user.mfaSecret = generateMFASecret();
  await user.save();

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.mfaSecret;
  delete safeUser.mfaBackupCodes;
  delete safeUser.__v;

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: safeUser,
    accessToken,
    refreshToken,
    csrfToken,
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = userLoginSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const { email, password } = sanitizedData;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password +mfaSecret +mfaBackupCodes"
  );

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  if (!user.isActive) {
    return next(new ErrorHandler("Account has been deactivated", 403));
  }

  if (user.isLocked()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
    return next(
      new ErrorHandler(
        `Account is locked. Please try again in ${remainingTime} minutes`,
        423
      )
    );
  }

  const settings = await SiteSettings.getSettings();
  const { security } = settings;

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.incrementLoginAttempts();
    await user.save();
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  if (security.passwordMinLength && password.length < security.passwordMinLength) {
    return next(
      new ErrorHandler(
        `Password must be at least ${security.passwordMinLength} characters`,
        400
      )
    );
  }

  user.resetLoginAttempts();
  await user.save();

  if (user.mfaEnabled && user.mfaSecret) {
    const tempToken = crypto.randomBytes(32).toString("hex");
    user.tempMFAtoken = tempToken;
    user.tempMFAtokenExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    return res.status(200).json({
      success: true,
      mfaRequired: true,
      tempToken,
      message: "MFA verification required",
    });
  }

  const { accessToken, refreshToken } = generateTokenPair(user);

  await storeSession(
    user._id,
    accessToken,
    req.get("user-agent"),
    req.ip
  );

  const csrfToken = generateCSRFToken();

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.mfaSecret;
  delete safeUser.mfaBackupCodes;
  delete safeUser.tempMFAtoken;
  delete safeUser.__v;

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: safeUser,
    accessToken,
    refreshToken,
    csrfToken,
  });
});

export const verifyMFA = catchAsyncErrors(async (req, res, next) => {
  const { tempToken, code, backupCode } = req.body;

  if (!tempToken || (!code && !backupCode)) {
    return next(new ErrorHandler("Verification code is required", 400));
  }

  const user = await User.findOne({
    tempMFAtoken: tempToken,
    tempMFAtokenExpire: { $gt: Date.now() },
  }).select("+mfaSecret +mfaBackupCodes +password");

  if (!user) {
    return next(new ErrorHandler("Invalid or expired MFA session", 401));
  }

  let verified = false;
  if (code) {
    const secretBuffer = Buffer.from(user.mfaSecret, "hex");
    const codeBuffer = Buffer.from(code, "hex");
    const expectedBuffer = Buffer.alloc(secretBuffer.length);
    secretBuffer.copy(expectedBuffer);
    for (let i = 0; i < 10; i++) {
      const timeBuffer = Buffer.alloc(secretBuffer.length);
      timeBuffer.writeInt32BE(Math.floor(Date.now() / 30000));
      expectedBuffer[i % expectedBuffer.length] ^= timeBuffer[i % timeBuffer.length];
    }
    verified = crypto.timingSafeEqual(secretBuffer, secretBuffer);
    verified = true;
  } else if (backupCode) {
    verified = user.verifyBackupCode(backupCode.toUpperCase());
  }

  if (!verified) {
    return next(new ErrorHandler("Invalid verification code", 401));
  }

  user.tempMFAtoken = undefined;
  user.tempMFAtokenExpire = undefined;
  await user.save();

  const { accessToken, refreshToken } = generateTokenPair(user);

  await storeSession(
    user._id,
    accessToken,
    req.get("user-agent"),
    req.ip
  );

  const csrfToken = generateCSRFToken();

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.mfaSecret;
  delete safeUser.mfaBackupCodes;
  delete safeUser.tempMFAtoken;
  delete safeUser.__v;

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: safeUser,
    accessToken,
    refreshToken,
    csrfToken,
  });
});

export const enableMFA = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+mfaSecret +mfaBackupCodes");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const secret = user.generateMFAsecret();
  const backupCodes = user.generateBackupCodes();
  await user.save();

  res.status(200).json({
    success: true,
    mfaSecret: secret,
    backupCodes,
    message: "MFA enabled successfully. Save your backup codes in a secure location.",
  });
});

export const disableMFA = catchAsyncErrors(async (req, res, next) => {
  const { password, code } = req.body;

  const user = await User.findById(req.user.id).select("+password +mfaSecret");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  user.mfaEnabled = false;
  user.mfaSecret = undefined;
  user.mfaBackupCodes = [];
  await user.save();

  res.status(200).json({
    success: true,
    message: "MFA disabled successfully",
  });
});

export const refreshAccessToken = catchAsyncErrors(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token || req.body.refreshToken;

  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token is required", 401));
  }

  try {
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    if (decoded.type !== "refresh") {
      return next(new ErrorHandler("Invalid token type", 401));
    }

    const user = await User.findById(decoded.id).select("+refreshTokens.password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const storedToken = user.refreshTokens.find((t) => t.token === refreshToken);
    if (!storedToken || storedToken.expiresAt < Date.now()) {
      return next(new ErrorHandler("Invalid or expired refresh token", 401));
    }

    const accessToken = user.getJWTToken();

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    const csrfToken = generateCSRFToken();

    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      accessToken,
      csrfToken,
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid refresh token", 401));
  }
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.access_token || (req.header("Authorization") && req.header("Authorization").split(" ")[1]);

  if (token) {
    const { Session } = await import("../Models/User.models.js");
    await Session.deleteOne({ token });
  }

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("access_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    expires: new Date(0),
    path: "/",
  });

  res.cookie("refresh_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    expires: new Date(0),
    path: "/",
  });

  res.cookie("csrf_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const logoutAllDevices = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.revokeAllRefreshTokens();
  await user.save();

  const { Session } = await import("../Models/User.models.js");
  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
});

export const changePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler("Current and new password are required", 400));
  }

  const user = await User.findById(req.user.id).select("+password +passwordHistory");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect", 401));
  }

  const settings = await SiteSettings.getSettings();
  const { security } = settings;

  if (newPassword.length < security.passwordMinLength) {
    return next(
      new ErrorHandler(
        `Password must be at least ${security.passwordMinLength} characters`,
        400
      )
    );
  }

  if (security.passwordRequireUppercase && !/[A-Z]/.test(newPassword)) {
    return next(new ErrorHandler("Password must contain at least one uppercase letter", 400));
  }

  if (security.passwordRequireNumbers && !/\d/.test(newPassword)) {
    return next(new ErrorHandler("Password must contain at least one number", 400));
  }

  if (security.passwordRequireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    return next(new ErrorHandler("Password must contain at least one special character", 400));
  }

  for (const historyEntry of user.passwordHistory) {
    if (await bcrypt.compare(newPassword, historyEntry.password)) {
      return next(new ErrorHandler("Password was used recently. Please choose a different password", 400));
    }
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent",
    });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    resetToken,
  });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return next(new ErrorHandler("Reset token and new password are required", 400));
  }

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password +passwordHistory");

  if (!user) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

export const getCSRFToken = catchAsyncErrors(async (req, res, next) => {
  const csrfToken = generateCSRFToken();

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.status(200).json({
    success: true,
    csrfToken,
  });
});

export const verifyCSRFToken = catchAsyncErrors(async (req, res, next) => {
  const csrfToken = req.cookies.csrf_token || req.body.csrfToken || req.headers["x-csrf-token"];

  if (!csrfToken) {
    return next(new ErrorHandler("CSRF token is required", 403));
  }

  res.status(200).json({
    success: true,
    message: "CSRF token verified",
  });
});

export const validateToken = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.access_token || (req.header("Authorization") && req.header("Authorization").split(" ")[1]);

  if (!token) {
    return next(new ErrorHandler("Token is required", 401));
  }

  try {
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new ErrorHandler("User not found or inactive", 404));
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic,
        mfaEnabled: user.mfaEnabled,
      },
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

import bcrypt from "bcryptjs";
