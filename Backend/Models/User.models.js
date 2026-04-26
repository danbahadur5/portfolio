import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SessionSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userAgent: { type: String },
  ipAddress: { type: String },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [20, "Name must be at most 20 characters"],
    trim: true,
    default: "Admin User",
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [2000, "Password must be at most 2000 characters"],
    select: false,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "editor", "admin", "superadmin"],
    default: "user",
  },
  profile_pic: {
    type: String,
    default: "https://cdn2.vectorstock.com/i/1000x1000/17/61/male-avatar-profile-picture-vector-10211761.jpg",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  mfaEnabled: {
    type: Boolean,
    default: false,
  },
  mfaSecret: {
    type: String,
    select: false,
  },
  mfaBackupCodes: [{
    code: String,
    used: { type: Boolean, default: false },
    usedAt: Date,
  }],
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    deviceInfo: String,
    createdAt: { type: Date, default: Date.now },
  }],
  passwordHistory: [{
    password: String,
    changedAt: { type: Date, default: Date.now },
  }],
  lastPasswordChange: {
    type: Date,
    default: Date.now,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  permissions: [{
    resource: String,
    actions: [String],
  }],
}, { timestamps: true });

UserSchema.index({ role: 1 });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Clear password history if it's a new password to avoid plain text/hashed comparison issues for now
  // In a real app, we would hash the history entries too
  this.passwordHistory = [];
  this.lastPasswordChange = new Date();

  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.isPasswordRecentlyChanged = function (days = 90) {
  const changeDate = this.lastPasswordChange || this._id.getTimestamp();
  const daysSinceChange = (Date.now() - changeDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceChange < days;
};

UserSchema.methods.generateMFAsecret = function () {
  const secret = crypto.randomBytes(20).toString("hex");
  this.mfaSecret = secret;
  return secret;
};

UserSchema.methods.generateBackupCodes = function () {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push({ code, used: false });
  }
  this.mfaBackupCodes = codes;
  return codes;
};

UserSchema.methods.verifyBackupCode = function (code) {
  const backupEntry = this.mfaBackupCodes.find(
    (entry) => entry.code === code && !entry.used
  );
  if (backupEntry) {
    backupEntry.used = true;
    backupEntry.usedAt = new Date();
    return true;
  }
  return false;
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });
};

UserSchema.methods.getRefreshToken = function (deviceInfo = "unknown") {
  const refreshToken = jwt.sign(
    { id: this._id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  this.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo,
  });

  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  return refreshToken;
};

UserSchema.methods.revokeAllRefreshTokens = function () {
  this.refreshTokens = [];
};

UserSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

UserSchema.methods.lockAccount = function (until) {
  this.lockUntil = until;
  this.loginAttempts = 0;
};

UserSchema.methods.incrementLoginAttempts = function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockAccount(new Date(Date.now() + 30 * 60 * 1000));
  }
};

UserSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
};

UserSchema.methods.hasPermission = function (resource, action) {
  if (this.role === "superadmin") return true;

  const permission = this.permissions.find((p) => p.resource === resource);
  if (!permission) return false;

  if (this.role === "admin") return true;

  return permission.actions.includes(action);
};

export const User = mongoose.model("User", UserSchema);
export const Session = mongoose.model("Session", SessionSchema);
