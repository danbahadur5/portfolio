/**
 * Basic sanitization function to prevent XSS and other injection attacks.
 * It removes HTML tags and trims whitespace.
 */
export const sanitize = (data) => {
  if (typeof data === "string") {
    return data
      .replace(/<[^>]*>?/gm, "") // Remove HTML tags
      .trim();
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }
  if (typeof data === "object" && data !== null) {
    const sanitizedObject = {};
    for (const key in data) {
      sanitizedObject[key] = sanitize(data[key]);
    }
    return sanitizedObject;
  }
  return data;
};

/**
 * Specifically sanitizes an object by keys.
 */
export const sanitizeObject = (obj, keys) => {
  const sanitized = { ...obj };
  keys.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = sanitize(sanitized[key]);
    }
  });
  return sanitized;
};
