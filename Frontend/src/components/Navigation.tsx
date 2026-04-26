import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Github,
  Linkedin,
  Twitter,
  Home,
  User,
  Briefcase,
  BookOpen,
  Mail,
  LogIn,
  SunSnow,
  LayoutDashboard,
  Sparkles,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { isAuthenticated, isAdmin, getUserRole } from "@/utils/auth-helpers";
import { useSiteSettings } from "@/hooks/useSiteSettings";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const iconMap: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = isAuthenticated();
  const role = getUserRole();
  const showDashboard = role === "admin" || role === "superadmin" || role === "editor";

  const navItems = [
    { id: "home", path: "/", label: "Home", icon: Home },
    {
      id: "projects",
      path: "/projects",
      label: "Projects",
      icon: Briefcase,
      enabled: settings?.features?.projects !== false,
    },
    { id: "about", path: "/about", label: "About", icon: User },
    {
      id: "blog",
      path: "/blog",
      label: "Blog",
      icon: BookOpen,
      enabled: settings?.features?.blog !== false,
    },
    { id: "contact", path: "/contact", label: "Contact", icon: Mail },
    ...(showDashboard
      ? [
          {
            id: "dashboard",
            path: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),
  ].filter((item) => item.enabled !== false);

  const socialLinks = settings?.socialLinks
    ?.filter(link => link.enabled)
    .map(link => ({
      icon: iconMap[link.platform.toLowerCase()] || Globe,
      href: link.url,
      label: link.platform,
    })) || [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 xs:w-10 xs:h-10 md:w-11 md:h-11 flex items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm">
              <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              <motion.div 
                className="absolute inset-0 bg-primary/20"
                initial={false}
                whileHover={{ scale: 1.5, opacity: 0 }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base xs:text-lg md:text-xl tracking-tight leading-none group-hover:text-primary transition-colors">
                {settings?.siteName || "Portfolio"}
              </span>
              <span className="text-[9px] xs:text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:block">
                {settings?.siteTagline || "CMS Powered"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary"
                      asChild
                    >
                      <a href={social.href} target="_blank" rel="noopener noreferrer" title={social.label}>
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>

              <div className="w-px h-4 bg-border" />

              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <SheetTitle className="text-xl font-bold leading-none">
                          {settings?.siteName || "Portfolio"}
                        </SheetTitle>
                        <span className="text-xs text-muted-foreground mt-1">
                          {settings?.siteTagline || "CMS Powered"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="p-8 border-t bg-background">
                    <div className="space-y-6">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Connect</span>
                      <div className="grid grid-cols-4 gap-3">
                        {socialLinks.map((social) => {
                          const Icon = social.icon;
                          return (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                            >
                              <Icon className="w-5 h-5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

