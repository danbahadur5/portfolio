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

import { isAuthenticated, isAdmin } from "@/utils/auth";
import { useAbout } from "@/hooks/useAbout";
import { useContact } from "@/hooks/useContact";

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

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: aboutInfo } = useAbout();
  const { data: contactInfo } = useContact();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = isAuthenticated();
  const showDashboard = isAdmin();

  const navItems = [
    { id: "home", path: "/", label: "Home", icon: Home },
    { id: "projects", path: "/projects", label: "Projects", icon: Briefcase },
    { id: "about", path: "/about", label: "About", icon: User },
    { id: "blog", path: "/blog", label: "Blog", icon: BookOpen },
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
      : !isLoggedIn
        ? [{ id: "login", path: "/login", label: "Login", icon: LogIn }]
        : []),
  ];

  const socialLinks = [
    {
      icon: Github,
      href: contactInfo?.github_profile || "https://github.com/danbahadur2060",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: contactInfo?.linkedin_profile || "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: contactInfo?.twitter_profile || "https://twitter.com",
      label: "Twitter",
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return "DBB";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 3).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "") + (parts[2]?.[0] || ""))
      .toUpperCase()
      .substring(0, 3);
  };

  const logoText = getInitials(aboutInfo?.name);
  const firstLetter = logoText.charAt(0);
  const restLetters = logoText.slice(1);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 py-4 md:px-8"
      >
        <div
          className={`relative rounded-3xl transition-all duration-700 pointer-events-auto flex items-center justify-between ${
            scrolled
              ? "bg-background/80 backdrop-blur-2xl h-16 px-6 md:px-8 shadow-2xl border border-white/10"
              : "bg-transparent h-20 px-4 border-transparent"
          }`}
        >
          {/* Enhanced Logo Section - Realistic & Unique Industrial Identity */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onPageChange("home");
              setIsMobileMenuOpen(false);
              navigate("/");
            }}
            className="flex items-center gap-3 group relative"
          >
            <div className="relative">
              {/* 3D Realistic Industrial Logo Container */}
              <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-slate-950 border border-primary/20 dark:border-primary/40 flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_24px_-4px_rgba(var(--primary),0.3)] transition-all duration-500 overflow-hidden group-hover:border-primary group-hover:shadow-primary/30">
                {/* Metallic Depth Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/50 dark:bg-white/10" />

                {/* Industrial Bezel Layer */}
                <div className="absolute inset-[1.5px] rounded-[9px] border border-white/30 dark:border-white/5 pointer-events-none" />

                {/* Logo Lettering with Bespoke Typographic Feel */}
                <div className="relative flex items-center justify-center">
                  <span className="text-primary font-black font-heading text-lg tracking-tighter drop-shadow-[0_1px_2px_rgba(var(--primary),0.2)] dark:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)] group-hover:scale-105 transition-transform duration-500">
                    {firstLetter}
                  </span>
                </div>

                {/* Precision Sweeping Shine */}
                <motion.div
                  animate={{ x: ["-300%", "300%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 dark:via-white/5 to-transparent skew-x-[-30deg] pointer-events-none"
                />
              </div>

              {/* Unique Minimalist Orbital Detail */}
              <div className="absolute inset-[-2px] rounded-[13px] border border-primary/0 group-hover:border-primary/15 transition-all duration-700 pointer-events-none" />
            </div>

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <span className="font-heading font-black text-lg tracking-tighter leading-none text-foreground group-hover:text-primary transition-colors duration-300">
                  {restLetters}
                </span>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-primary"
                />
              </div>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 leading-none mt-1 group-hover:text-primary/50 transition-colors">
                Digital Architect
              </span>
            </div>
          </motion.button>

          {/* Compact Nav Items - Refined to Fit Better */}
          <div className="hidden lg:flex items-center gap-1 bg-white/20 dark:bg-slate-950/20 p-1 rounded-[1.25rem] border border-white/10 dark:border-white/5 backdrop-blur-xl shadow-inner">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`relative px-3.5 py-2 text-[9px] font-black transition-all duration-500 rounded-xl flex items-center gap-2 group overflow-hidden ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill-compact"
                        className="absolute inset-0 bg-primary shadow-lg shadow-primary/20"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <Icon
                    className={`w-3.5 h-3.5 relative z-10 transition-all duration-500 ${
                      isActive ? "scale-105" : "group-hover:scale-110"
                    }`}
                  />

                  <span className="relative z-10 uppercase tracking-[0.1em] font-black">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Fit Actions - Improved Mobile Layout */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link to="/contact">
              <Button className="rounded-xl px-4 h-8 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all">
                Hire Now
              </Button>
            </Link>

            {/* Mobile Menu Trigger - Always visible on mobile/tablet */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl w-10 h-10 bg-primary/5 text-primary hover:bg-primary/10 hover:scale-105 transition-all"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-[360px] p-0 border-l border-primary/10 bg-background/98 backdrop-blur-3xl"
                >
                  <SheetHeader className="p-6 border-b border-primary/10 bg-white/50 dark:bg-muted/10">
                    <SheetTitle className="text-left flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20 relative overflow-hidden">
                        <span className="text-primary-foreground font-black font-heading text-xl relative z-10">
                          {firstLetter}
                        </span>
                        <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] translate-x-[-100%] animate-[shine_3s_infinite]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading font-black text-2xl tracking-tighter leading-none text-foreground">
                          {restLetters}
                        </span>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60 mt-1">
                          Digital Architect
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-140px)]">
                    <div className="grid grid-cols-1 gap-4">
                      {navItems.map((item) => {
                        const isActive =
                          item.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(item.path);
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onPageChange(item.id);
                              setIsMobileMenuOpen(false);
                              navigate(item.path);
                            }}
                            className={`flex items-center gap-6 w-full px-6 py-5 text-lg font-bold transition-all duration-500 rounded-2xl border ${
                              isActive
                                ? "text-primary-foreground bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5 border-transparent hover:border-primary/20"
                            }`}
                          >
                            <Icon
                              className={`w-7 h-7 ${isActive ? "scale-110" : ""}`}
                            />
                            <span className="tracking-tight uppercase tracking-wider">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-primary/10">
                      <h4 className="font-heading font-bold text-sm mb-6 text-muted-foreground uppercase tracking-[0.5em]">
                        Connect
                      </h4>
                      <div className="flex gap-4">
                        {socialLinks.map((social) => {
                          const Icon = social.icon;
                          return (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-muted/30 border border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-xl hover:scale-105"
                              aria-label={social.label}
                            >
                              <Icon className="w-6 h-6" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Actions - Improved Touch Targets */}
          <div className="lg:hidden flex items-center gap-3">
            <Link to="/contact">
              <Button
                size="sm"
                className="rounded-lg px-3 h-9 font-bold text-xs uppercase tracking-wide shadow-md hover:scale-105 transition-all"
              >
                Hire Me
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg w-10 h-10 bg-muted/20 hover:bg-primary/10 hover:scale-105 transition-all"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.nav>
    </header>
  );
}
