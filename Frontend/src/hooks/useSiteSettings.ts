import { useSiteContext } from "../contexts/SiteContext";

export interface PublicSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logo: string;
  ogImage: string;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
    enabled: boolean;
    order: number;
  }>;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
  features: {
    blog: boolean;
    projects: boolean;
    contactForm: boolean;
    testimonials: boolean;
    analytics: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
  };
}

export const useSiteSettings = () => {
  const { settings, isLoading, error } = useSiteContext();
  return { data: settings, isLoading, error };
};
