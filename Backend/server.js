import { app } from "./app.js";
import { connectDB } from "./Configs/DB.configs.js";
import logger from "./utils/logger.js";

const port = process.env.PORT || 4000;

// Connect to database before starting server
connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
  });
}).catch((error) => {
  logger.error("Failed to connect to database:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  process.exit(1);
});
