import { ErrorHandler } from "../Middlewares/error.middlewares.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: ''
        }
      }
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return next(new ErrorHandler(errorMessage, 400));
    }

    next();
  };
};
