import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  role: {
    type: String,
    trim: true,
    maxlength: [100, "Role cannot exceed 100 characters"],
    default: "",
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, "Company cannot exceed 100 characters"],
    default: "",
  },
  content: {
    type: String,
    required: [true, "Testimonial content is required"],
    maxlength: [1000, "Testimonial cannot exceed 1000 characters"],
  },
  rating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
    default: 5,
  },
  avatar: {
    type: String,
    default: "",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  linkedinUrl: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: "testimonials",
});

TestimonialSchema.index({ featured: 1, approved: 1 });
TestimonialSchema.index({ order: 1 });

TestimonialSchema.statics.getApproved = async function (featuredOnly = false) {
  const query = { approved: true, isActive: true };
  if (featuredOnly) {
    query.featured = true;
  }
  return this.find(query).sort({ order: 1, createdAt: -1 });
};

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
