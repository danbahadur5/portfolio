import { useState, useEffect } from "react";
import api from "../utils/api";

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
  const [data, setData] = useState<PublicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/api/public-settings");
        if (response.data.success) {
          setData(response.data.settings);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { data, isLoading, error };
};
