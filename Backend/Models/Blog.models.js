import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    maxlength: [100, "Author name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [1000, "Comment cannot exceed 1000 characters"],
  },
  approved: {
    type: Boolean,
    default: false,
  },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  excerpt: {
    type: String,
    maxlength: [500, "Excerpt cannot exceed 500 characters"],
    default: "",
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  featuredImage: {
    type: String,
    default: "",
  },
  featuredImageCaption: {
    type: String,
    maxlength: [200, "Caption cannot exceed 200 characters"],
    default: "",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  category: {
    type: String,
    default: "General",
    maxlength: [50, "Category cannot exceed 50 characters"],
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  publishedAt: {
    type: Date,
  },
  scheduledAt: {
    type: Date,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  comments: [CommentSchema],
  commentCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  seo: {
    metaTitle: { type: String, maxlength: [60, "Meta title cannot exceed 60 characters"] },
    metaDescription: { type: String, maxlength: [160, "Meta description cannot exceed 160 characters"] },
    ogImage: { type: String },
    noIndex: { type: Boolean, default: false },
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  collection: "blogs",
});

BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ author: 1 });

BlogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

BlogSchema.statics.getPublished = async function (options = {}) {
  const { limit = 10, skip = 0, tag, category, author } = options;
  const query = { status: "published", isActive: true };

  if (tag) query.tags = tag;
  if (category) query.category = category;
  if (author) query.author = author;

  return this.find(query)
    .populate("author", "name profile_pic")
    .sort({ featured: -1, publishedAt: -1 })
    .skip(skip)
    .limit(limit);
};

BlogSchema.statics.incrementViews = async function (slug) {
  return this.findOneAndUpdate(
    { slug },
    { $inc: { viewCount: 1 } },
    { new: true }
  );
};

export const Blog = mongoose.model("Blog", BlogSchema);
export { CommentSchema };
