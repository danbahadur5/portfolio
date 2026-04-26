import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { toast } from "react-toastify";
import { Loader2, Save, Globe, Palette, Shield, Mail, Search, Zap, Database, Lock } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  ogImage: string;
  seo: {
    home: { title: string; description: string; keywords: string[]; ogImage: string; noIndex: boolean };
    about: { title: string; description: string; keywords: string[]; ogImage: string; noIndex: boolean };
    projects: { title: string; description: string; keywords: string[]; ogImage: string; noIndex: boolean };
    blog: { title: string; description: string; keywords: string[]; ogImage: string; noIndex: boolean };
    contact: { title: string; description: string; keywords: string[]; ogImage: string; noIndex: boolean };
  };
  socialLinks: Array<{ platform: string; url: string; icon: string; enabled: boolean; order: number }>;
  navigation: {
    header: Array<{ label: string; path: string; order: number; enabled: boolean; external: boolean }>;
    footer: Array<{ label: string; path: string; order: number; enabled: boolean; external: boolean }>;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    twitter: string;
  };
  maintenance: { enabled: boolean; message: string; allowedIPs: string[] };
  features: {
    blog: boolean;
    projects: boolean;
    contactForm: boolean;
    testimonials: boolean;
    analytics: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    imageOptimization: boolean;
    lazyLoading: boolean;
  };
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecial: boolean;
    mfaEnabled: boolean;
    sessionTimeout: number;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
    customCSS: string;
  };
  analytics: { googleAnalytics: string; googleTagManager: string; facebookPixel: string };
  email: { notificationsEnabled: boolean; contactFormTo: string; notificationFrom: string };
  meta: { author: string; copyright: string; robots: string };
}

export function SettingsSection() {
  const { hasPermission } = useAuth();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const canEditSettings = hasPermission("settings", "edit");

  useEffect(() => {
    if (canEditSettings) {
      fetchSettings();
    } else {
      setIsLoading(false);
    }
  }, [canEditSettings]);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/api/settings");
      setSettings(response.data.settings);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section: string, data: any) => {
    setIsSaving(true);
    try {
      await api.put(`/api/settings/${section}`, data);
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
      fetchSettings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneralSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await api.put("/api/settings", {
        siteName: settings.siteName,
        siteTagline: settings.siteTagline,
        siteDescription: settings.siteDescription,
        logo: settings.logo,
        favicon: settings.favicon,
        ogImage: settings.ogImage,
      });
      toast.success("General settings saved successfully");
      fetchSettings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canEditSettings) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Lock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">Access Restricted</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don't have permission to view or modify site settings. Please contact an administrator if you need access.
          </p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your site configuration and preferences</p>
        </div>
        <Badge variant="outline" className="text-xs">
          Version 1.0.0
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> SEO
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Theme
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Features
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={settings.siteTagline}
                    onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={settings.logo}
                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    value={settings.favicon}
                    onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    value={settings.ogImage}
                    onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Social Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={settings.contact.linkedin}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, linkedin: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={settings.contact.github}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, github: e.target.value } })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleGeneralSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Configure search engine optimization for each page</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="home">
                <TabsList>
                  <TabsTrigger value="home">Home</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                {["home", "about", "projects", "blog", "contact"].map((page) => (
                  <TabsContent key={page} value={page} className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <Input
                          value={settings.seo[page as keyof typeof settings.seo]?.title || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            seo: {
                              ...settings.seo,
                              [page]: { ...settings.seo[page as keyof typeof settings.seo], title: e.target.value }
                            }
                          })}
                          placeholder={`${settings.siteName} - ${page}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <Input
                          value={settings.seo[page as keyof typeof settings.seo]?.description || ""}
                          onChange={(e) => setSettings({
                            ...settings,
                            seo: {
                              ...settings.seo,
                              [page]: { ...settings.seo[page as keyof typeof settings.seo], description: e.target.value }
                            }
                          })}
                          placeholder="Enter SEO description"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.seo[page as keyof typeof settings.seo]?.noIndex || false}
                          onCheckedChange={(checked) => setSettings({
                            ...settings,
                            seo: {
                              ...settings.seo,
                              [page]: { ...settings.seo[page as keyof typeof settings.seo], noIndex: checked }
                            }
                          })}
                        />
                        <Label>No Index (discourage search engines)</Label>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => handleSave(`seo/${page}`, settings.seo[page as keyof typeof settings.seo])}>
                        Save {page.charAt(0).toUpperCase() + page.slice(1)} SEO
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the visual appearance of your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.theme.primaryColor}
                      onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.theme.primaryColor}
                      onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.theme.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.theme.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, secondaryColor: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.theme.accentColor}
                      onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: e.target.value } })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={settings.theme.accentColor}
                      onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, accentColor: e.target.value } })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode by default</p>
                </div>
                <Switch
                  checked={settings.theme.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, theme: { ...settings.theme, darkMode: checked } })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("theme", settings.theme)}>
                  Save Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, lockoutDuration: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Password Requirements</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.passwordRequireUppercase}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordRequireUppercase: checked }
                      })}
                    />
                    <Label>Uppercase Letter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.passwordRequireNumbers}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordRequireNumbers: checked }
                      })}
                    />
                    <Label>Numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.passwordRequireSpecial}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordRequireSpecial: checked }
                      })}
                    />
                    <Label>Special Characters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.mfaEnabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, mfaEnabled: checked }
                      })}
                    />
                    <Label>MFA Required</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.maintenance.enabled ? "Site is under maintenance" : "Site is live"}
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance.enabled}
                  onCheckedChange={(checked) => handleSave("maintenance", {
                    enabled: checked,
                    message: settings.maintenance.message,
                    allowedIPs: settings.maintenance.allowedIPs
                  })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("security", settings.security)}>
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable site features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(settings.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-base capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "blog" && "Show blog posts on the site"}
                        {key === "projects" && "Display portfolio projects"}
                        {key === "contactForm" && "Enable contact form submissions"}
                        {key === "testimonials" && "Show client testimonials"}
                        {key === "analytics" && "Enable analytics tracking"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => {
                        setSettings({
                          ...settings,
                          features: { ...settings.features, [key]: checked }
                        });
                        handleSave("features", { ...settings.features, [key]: checked });
                      }}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Caching</Label>
                    <p className="text-sm text-muted-foreground">Cache API responses</p>
                  </div>
                  <Switch
                    checked={settings.performance.cacheEnabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      performance: { ...settings.performance, cacheEnabled: checked }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Image Optimization</Label>
                    <p className="text-sm text-muted-foreground">Auto-optimize uploaded images</p>
                  </div>
                  <Switch
                    checked={settings.performance.imageOptimization}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      performance: { ...settings.performance, imageOptimization: checked }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch
                  checked={settings.email.notificationsEnabled}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    email: { ...settings.email, notificationsEnabled: checked }
                  })}
                />
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactFormTo">Contact Form Recipient</Label>
                  <Input
                    id="contactFormTo"
                    type="email"
                    value={settings.email.contactFormTo}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, contactFormTo: e.target.value }
                    })}
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationFrom">Notification Sender</Label>
                  <Input
                    id="notificationFrom"
                    type="email"
                    value={settings.email.notificationFrom}
                    onChange={(e) => setSettings({
                      ...settings,
                      email: { ...settings.email, notificationFrom: e.target.value }
                    })}
                    placeholder="noreply@example.com"
                  />
                </div>
              </div>

              <Separator />

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    value={settings.analytics.googleAnalytics}
                    onChange={(e) => setSettings({
                      ...settings,
                      analytics: { ...settings.analytics, googleAnalytics: e.target.value }
                    })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                  <Input
                    id="googleTagManager"
                    value={settings.analytics.googleTagManager}
                    onChange={(e) => setSettings({
                      ...settings,
                      analytics: { ...settings.analytics, googleTagManager: e.target.value }
                    })}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("analytics", settings.analytics)}>
                  Save Email & Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
