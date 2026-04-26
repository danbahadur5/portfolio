export type UserRole = "user" | "editor" | "admin" | "superadmin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_pic: string;
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  mfaRequired: boolean;
  tempToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface MFACredentials {
  tempToken: string;
  code?: string;
  backupCode?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  sourceUrl: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageCaption: string;
  author: User | string;
  tags: string[];
  category: string;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  scheduledAt?: string;
  featured: boolean;
  allowComments: boolean;
  commentCount: number;
  viewCount: number;
  readingTime: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  featured: boolean;
  approved: boolean;
  linkedinUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  technical: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  startDate: string;
  endDate?: string;
  current: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface About {
  _id: string;
  name: string;
  title: string;
  bio: string;
  profile_pic: string;
  location: string;
  email: string;
}

export interface HomeContent {
  _id: string;
  name: string;
  position: string;
  description: string;
  profile_pic: string;
  summary: string;
  location: string;
  cvUrl?: string;
  availableForWork: boolean;
}

export interface Contact {
  _id: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  twitter: string;
  website: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  noIndex: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface NavigationItem {
  label: string;
  path: string;
  order: number;
  enabled: boolean;
  external: boolean;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  customCSS: string;
}

export interface Features {
  blog: boolean;
  projects: boolean;
  contactForm: boolean;
  testimonials: boolean;
  analytics: boolean;
}

export interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  allowedIPs: string[];
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecial: boolean;
  mfaEnabled: boolean;
  sessionTimeout: number;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  ogImage: string;
  seo: {
    home: SEOSettings;
    about: SEOSettings;
    projects: SEOSettings;
    blog: SEOSettings;
    contact: SEOSettings;
  };
  socialLinks: SocialLink[];
  navigation: {
    header: NavigationItem[];
    footer: NavigationItem[];
  };
  contact: Contact;
  maintenance: MaintenanceSettings;
  features: Features;
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    imageOptimization: boolean;
    lazyLoading: boolean;
  };
  security: SecuritySettings;
  theme: Theme;
  analytics: {
    googleAnalytics: string;
    googleTagManager: string;
    facebookPixel: string;
  };
  email: {
    notificationsEnabled: boolean;
    contactFormTo: string;
    notificationFrom: string;
  };
  meta: {
    author: string;
    copyright: string;
    robots: string;
  };
}

export interface DashboardOverview {
  totalProjects: number;
  totalBlogs: number;
  totalMessages: number;
  unreadMessages: number;
  totalUsers: number;
  totalTestimonials: number;
  totalViews: number;
}

export interface DashboardStats {
  projectsCount: number;
  blogsCount: number;
  messagesCount: number;
  viewsCount: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: "project" | "blog" | "message" | "testimonial";
  action: "created" | "updated" | "deleted";
  itemId: string;
  itemTitle: string;
  timestamp: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}
