import multer from "multer";
import fs from "fs";
import path from "path";

const uploadsDir = path.resolve(process.cwd(), "uploads");

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL;

const storage = isProd
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        try {
          // Ensure the uploads directory exists (dev/local only)
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          cb(null, uploadsDir);
        } catch (err) {
          cb(err);
        }
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
      },
    });

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"), false);
    }
  },
});
