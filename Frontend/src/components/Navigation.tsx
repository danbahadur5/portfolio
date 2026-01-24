import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Menu,
  X,
  Palette,
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
} from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [aboutInfo, setAboutInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backend = import.meta.env.VITE_BACKEND_URL;
        const [contactRes, aboutRes] = await Promise.all([
          axios.get(`${backend}/api/getcontact`),
          axios.get(`${backend}/api/getabout`),
        ]);

        if (contactRes.data.contacts && contactRes.data.contacts.length > 0) {
          setContactInfo(contactRes.data.contacts[0]);
        }
        if (aboutRes.data.about && aboutRes.data.about.length > 0) {
          setAboutInfo(aboutRes.data.about[0]);
        }
      } catch (error) {
        console.error("Failed to fetch nav data:", error);
      }
    };
    fetchData();
  }, []);

  // keep both an id (used by onPageChange/currentPage) and a path (used by Link/navigate)
  const isLoggedIn = (() => {
    try { return localStorage.getItem("isLoggedIn") === "true"; } catch { return false; }
  })();
  const role = (() => {
    try { return localStorage.getItem("role"); } catch { return null; }
  })();
  const showDashboard = isLoggedIn && role === "admin";

  const navItems = [
    { id: "home", path: "/", label: "Home", icon: Home },
    { id: "projects", path: "/projects", label: "Projects", icon: Briefcase },
    { id: "about", path: "/about", label: "About", icon: User },
    { id: "blog", path: "/blog", label: "Blog", icon: BookOpen },
    { id: "contact", path: "/contact", label: "Contact", icon: Mail },
    ...(showDashboard
      ? [{ id: "dashboard", path: "/dashboard", label: "Dashboard", icon: Palette }]
      : (!isLoggedIn ? [{ id: "login", path: "/login", label: "LogIn", icon: LogIn }] : [])),
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
    return (parts[0][0] + (parts[1]?.[0] || "") + (parts[2]?.[0] || "")).toUpperCase().substring(0, 3);
  };
  
  const logoText = getInitials(aboutInfo?.name);
  const firstLetter = logoText.charAt(0);
  const restLetters = logoText.slice(1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // lock body scroll while mobile menu open
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMobileMenuOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onPageChange("home");
                setIsMobileMenuOpen(false);
                navigate("/");
              }}
              className="relative font-bold text-xl text-foreground group"
            >
              <span className="relative cursor-pointer z-10">
                <span className="text-red-500">{firstLetter}</span>{restLetters}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => onPageChange(item.id)}
                    className={`relative px-4 py-2 text-sm transition-all duration-200 rounded-lg group ${
                      currentPage === item.id
                        ? "text-primary bg-accent/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    }`}
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.div>

                    {currentPage === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/30"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}

              <div className="w-px h-6 bg-border mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <SunSnow className="w-4 h-4" />
                    <span className="text-xs">
                      {themes.find((t) => t.value === theme)?.label}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-red-800">
                  {themes.map((themeOption) => (
                    <DropdownMenuItem
                      key={themeOption.value}
                      onSelect={() => setTheme(themeOption.value)}
                      className={`cursor-pointer ${
                        theme === themeOption.value ? "bg-accent" : ""
                      }`}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {themeOption.label}
                          </span>
                          {theme === themeOption.value && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {themeOption.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                className="relative"
              >
                <AnimatePresence>
                  <motion.div
                    key={isMobileMenuOpen ? "close" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-80 bg-background/95 backdrop-blur-md border-l border-border z-50 md:hidden"
              onClick={(e) => e.stopPropagation()} // important — don't let inside clicks close the overlay
            >
              <div className="p-6 h-full overflow-y-auto">
                {/* Navigation Items */}
                <div className="space-y-2 mb-8">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.06 }}
                        onClick={() => {
                          onPageChange(item.id);
                          setIsMobileMenuOpen(false);
                          navigate(item.path);
                        }}
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 text-base transition-all duration-200 rounded-lg ${
                          currentPage === item.id
                            ? "text-primary bg-accent border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-6">
                  {/* Social Links */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wider">
                      Connect
                    </h4>
                    <div className="flex gap-2">
                      {socialLinks.map((social, index) => {
                        const Icon = social.icon;
                        return (
                          <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.06 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-muted/50 hover:bg-accent rounded-xl transition-colors flex-1 flex items-center justify-center"
                            aria-label={social.label}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wider">
                      Theme
                    </h4>
                    <div className="space-y-2">
                      {themes.map((themeOption, index) => (
                        <motion.button
                          key={themeOption.value}
                          initial={{ x: 30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.06 }}
                          onClick={() => setTheme(themeOption.value)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            theme === themeOption.value
                              ? "bg-accent border border-primary/20"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {themeOption.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {themeOption.description}
                              </div>
                            </div>
                            {theme === themeOption.value && (
                              <div className="w-3 h-3 bg-primary rounded-full" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
