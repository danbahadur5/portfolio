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
import { Logo } from "./ui/Logo";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg py-3"
          : "bg-transparent py-6"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="responsive-container">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="hover-lift transition-transform"
            aria-label="Go to home page"
          >
            <Logo size="md" shortForm={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 py-2 text-sm font-bold tracking-tight uppercase transition-all duration-300 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavUnderline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2" aria-label="Social media links">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.label}
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-lift"
                      asChild
                    >
                      <a 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label={`Visit our ${social.label} profile`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </a>
                    </Button>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-border/50" />

              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-lift cursor-pointer"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4.5 h-4.5" />
                    ) : (
                      <Moon className="w-4.5 h-4.5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl bg-primary/5 hover:bg-primary/10"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90vw] max-w-[380px] sm:w-[380px] p-0 border-l-border/50">
                <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">
                  <div className="p-8 border-b border-border/50 flex items-center justify-between">
                    <Logo size="md" shortForm={true} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto py-10 px-6 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-4 mb-4 block">Navigation</span>
                    {navItems.map((item, index) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-bold transition-all duration-300 ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                            }`}
                          >
                            <item.icon className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-70"}`} />
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="p-10 border-t border-border/50 bg-muted/30">
                    <div className="space-y-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-1">Connect With Me</span>
                      <div className="grid grid-cols-4 gap-3 sm:gap-4">
                        {socialLinks.map((social, index) => {
                          const Icon = social.icon;
                          return (
                            <motion.a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.05 }}
                              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-[1.25rem] bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-sm border border-border/50 hover:border-primary/50 group"
                              aria-label={`Visit our ${social.label} profile`}
                            >
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-500" />
                            </motion.a>
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

