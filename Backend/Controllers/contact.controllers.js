import { Contact } from "../Models/Contact.models.js";
import { catchAsyncErrors, ErrorHandler } from "../Middlewares/error.middlewares.js";
import { contactSchema } from "../utils/validation.js";
import { sanitize } from "../utils/sanitization.js";

export const createContact = catchAsyncErrors(async (req, res, next) => {
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = contactSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const {
    email,
    phone,
    linkedin_profile,
    github_profile,
    twitter_profile,
    personal_website,
  } = sanitizedData;

  const contact = await Contact.create({
    email,
    phone,
    linkedin_profile,
    github_profile,
    twitter_profile,
    personal_website,
  });

  res.status(201).json({
    success: true,
    message: "Contact information added successfully",
    contact,
  });
});

export const getContacts = catchAsyncErrors(async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json({
    success: true,
    contacts,
  });
});

export const updateContact = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  // 1. Sanitize input
  const sanitizedData = sanitize(req.body);

  // 2. Validate input
  const { error } = contactSchema.validate(sanitizedData);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  const {
    email,
    phone,
    linkedin_profile,
    github_profile,
    twitter_profile,
    personal_website,
  } = sanitizedData;

  const contact = await Contact.findByIdAndUpdate(
    id,
    {
      email,
      phone,
      linkedin_profile,
      github_profile,
      twitter_profile,
      personal_website,
    },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return next(new ErrorHandler("Contact not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Contact updated successfully",
    contact,
  });
});

export const deleteContact = catchAsyncErrors(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return next(new ErrorHandler("Contact not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Contact deleted successfully",
  });
});
