import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "../utils/api";
import { PublicSettings } from "../hooks/useSiteSettings";

interface SiteContextType {
  settings: PublicSettings | null;
  isLoading: boolean;
  error: string | null;
  refetchSettings: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/public-settings");
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SiteContext.Provider value={{ settings, isLoading, error, refetchSettings: fetchSettings }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
};
