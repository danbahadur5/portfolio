import winston from "winston";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const logDir = process.env.LOG_DIR || "./logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(logColors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${
      info.stack ? `\n${info.stack}` : ""
    }`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || "info",
  }),
  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
    format: fileFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(logDir, "combined.log"),
    format: fileFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(logDir, "http.log"),
    level: "http",
    format: fileFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: logLevels,
  format,
  transports,
  exitOnError: false,
});

export class ErrorLogger {
  private static instance: ErrorLogger;
  private errorId: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  generateErrorId(): string {
    return crypto.randomBytes(4).toString("hex").toUpperCase();
  }

  logError(error: Error, context?: any): string {
    const errorId = this.generateErrorId();
    const errorData = {
      errorId,
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    logger.error(`[${errorId}] ${error.message}`, errorData);

    return errorId;
  }

  logRequest(req: any, error?: Error) {
    const requestData = {
      method: req.method,
      url: req.originalUrl || req.url,
      params: req.params,
      query: req.query,
      body: this.sanitizeBody(req.body),
      headers: {
        "user-agent": req.get("user-agent"),
        "content-type": req.get("content-type"),
        "x-forwarded-for": req.get("x-forwarded-for"),
      },
      ip: req.ip || req.connection?.remoteAddress,
      userId: req.user?._id,
      errorId: error ? this.generateErrorId() : undefined,
    };

    if (error) {
      logger.error(`[${requestData.errorId}] Request error: ${error.message}`, {
        ...requestData,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      });
    } else {
      logger.http(`${req.method} ${req.originalUrl}`, requestData);
    }
  }

  logAuth(userId: string, action: string, success: boolean, metadata?: any) {
    const level = success ? "info" : "warn";
    logger[level](`Auth ${action} for user ${userId}`, {
      userId,
      action,
      success,
      ...metadata,
    });
  }

  logDatabase(operation: string, collection: string, duration: number, metadata?: any) {
    logger.info(`Database ${operation} on ${collection}`, {
      operation,
      collection,
      duration: `${duration}ms`,
      ...metadata,
    });
  }

  logSecurity(event: string, severity: "low" | "medium" | "high", details: any) {
    const logLevel = severity === "high" ? "error" : severity === "medium" ? "warn" : "info";
    logger[logLevel](`Security: ${event}`, {
      event,
      severity,
      timestamp: new Date().toISOString(),
      ...details,
    });
  }

  logPerformance(operation: string, duration: number, metadata?: any) {
    const level = duration > 1000 ? "warn" : "info";
    logger[level](`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...metadata,
    });
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ["password", "token", "secret", "apiKey", "authorization", "cookie"];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}

export const errorLogger = ErrorLogger.getInstance();

export const requestLogger = (req: any, res: any, next: any) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    errorLogger.logRequest(req);

    if (duration > 1000) {
      errorLogger.logPerformance(`${req.method} ${req.originalUrl}`, duration);
    }
  });

  next();
};

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const errorId = errorLogger.logError(err, {
    method: req.method,
    url: req.originalUrl,
    userId: req.user?._id,
  });

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    error: {
      message,
      errorId,
    },
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export default logger;
