"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Code,
  Zap,
  Star,
  Users,
  Sparkles,
  Globe,
  Briefcase,
  Trophy,
  Rocket,
  MousePointer2,
  Cpu,
  Layers,
  Fingerprint,
  ShieldCheck,
  Check,
  Loader2,
  ArrowUpRight,
  ExternalLink,
  Terminal,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { PolaroidFrames } from "../PolaroidFrames";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { LoadingSpinner } from "../LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useBlogs } from "../../hooks/useBlogs";
import { useSkills } from "../../hooks/useSkills";
import { useHomeContent } from "../../hooks/useHomeContent";
import { useContact } from "../../hooks/useContact";
import { TagButton } from "../ui/TagButton";
import { Layout } from "../Layout";

export function HomePage() {
  const navigate = useNavigate();
  const [isHiring, setIsHiring] = React.useState(false);
  const [hired, setHired] = React.useState(false);

  const handleHireClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHiring || hired) return;

    setIsHiring(true);
    // Professional micro-interaction sequence: Loading -> Success -> Navigate
    setTimeout(() => {
      setIsHiring(false);
      setHired(true);
      setTimeout(() => {
        navigate("/contact");
      }, 1200);
    }, 1500);
  };

  const handleRocketClick = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start them higher
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'], // Colorful rainbow
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF4500'], // Fire/Rocket colors
      });
    }, 250);
  };

  const { data: homeContent, isLoading: isHomeLoading } = useHomeContent();
  const { projects, isLoading: isProjectsLoading } = useProjects();
  const { blogs, isLoading: isBlogsLoading } = useBlogs();
  const { skills: skillsData, isLoading: isSkillsLoading } = useSkills();
  const { data: contactInfo, isLoading: isContactLoading } = useContact();

  // Combine all skills from different categories in the dashboard
  const skills = useMemo(() => {
    if (!skillsData) return [];
    const { technical = [], languages = [], frameworks = [], tools = [] } = skillsData;
    return [...technical, ...languages, ...frameworks, ...tools];
  }, [skillsData]);

  const isLoading =
    isHomeLoading ||
    isProjectsLoading ||
    isBlogsLoading ||
    isSkillsLoading ||
    isContactLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const featuredProjects = projects?.slice(0, 2) || [];
  const featuredPosts = blogs?.slice(0, 3) || [];

  const socialLinks = [
    {
      icon: Github,
      href: contactInfo?.github_profile || "https://github.com",
      label: "GitHub",
      color: "hover:bg-primary hover:text-primary-foreground",
    },
    {
      icon: Linkedin,
      href: contactInfo?.linkedin_profile || "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:bg-primary hover:text-primary-foreground",
    },
    {
      icon: Twitter,
      href: contactInfo?.twitter_profile || "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-primary hover:text-primary-foreground",
    },
  ];

  const stats = [
    {
      label: "Experience",
      value: "2+ Yrs",
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Success Rate",
      value: "99%",
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Global Reach",
      value: "24/7",
      icon: Globe,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Live Apps",
      value: projects?.length || "12+",
      icon: Rocket,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const techFeatures = [
    {
      title: "Industrial Architecture",
      desc: "Building scalable and resilient systems using modern design patterns.",
      icon: Cpu,
      color: "text-blue-500",
    },
    {
      title: "High-Performance UI",
      desc: "Creating ultra-fast, accessible interfaces with a focus on UX.",
      icon: Layers,
      color: "text-cyan-500",
    },
    {
      title: "Secure Engineering",
      desc: "Implementing robust security protocols and safe data management.",
      icon: ShieldCheck,
      color: "text-emerald-500",
    },
    {
      title: "Unique Identity",
      desc: "Crafting bespoke digital experiences that define brand identity.",
      icon: Fingerprint,
      color: "text-indigo-500",
    },
  ];

  const splitTitle = (text: string) => {
    if (!text) return ["Engineering", "Digital", "Solutions"];
    const words = text.split(" ");
    if (words.length <= 2) return [words.join(" ")];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  };

  const [titleLine1, titleLine2] = splitTitle(homeContent?.position);

  return (
    <Layout>
      {/* Hero Section - Compact & Professional Layout */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center pb-8 md:pb-16"
        aria-label="Introduction"
      >
        {/* Background Decorative Layer - Enhanced for both modes */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500"
          aria-hidden="true"
        >
          <motion.div
            className="absolute top-[10%] md:top-[15%] left-[-5%] md:left-[-2%] whitespace-nowrap"
          >
            <span className="text-[15vw] md:text-[12vw] font-black text-primary/[0.03] dark:text-primary/[0.02] uppercase tracking-tighter leading-none select-none transition-colors duration-500">
              {homeContent?.name || "Portfolio"}
            </span>
          </motion.div>

          {/* Animated Mesh Gradients for Light Mode Vibrancy */}
          <div className="absolute top-[-10%] right-[-10%] w-[60%] md:w-[50%] h-[50%] bg-primary/5 dark:bg-primary/[0.02] rounded-full blur-[80px] md:blur-[120px] animate-pulse transition-colors duration-500" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] md:w-[40%] h-[40%] bg-accent/5 dark:bg-accent/[0.01] rounded-full blur-[70px] md:blur-[100px] animate-pulse delay-700 transition-colors duration-500" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-foreground)_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px] opacity-[0.05] dark:opacity-[0.02] transition-opacity duration-500" />
        </div>

        <div className="relative z-10 w-full">
          <motion.div
            className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-16 lg:gap-24 items-center"
          >
            {/* Left Content - Improved Mobile Layout */}
            <div className="relative order-1 lg:order-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Refined Status Badge - Better Mobile Visibility */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-4 mb-6 md:mb-8"
                >
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 dark:bg-primary/[0.03] border border-primary/10 dark:border-white/10 backdrop-blur-sm shadow-sm group">
                    <span className="relative flex h-1 w-1">
                      <span className="absolute h-full w-full rounded-full bg-primary/40 animate-ping" />
                      <span className="relative h-full w-full rounded-full bg-primary" />
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80 dark:text-primary/60">
                      {homeContent?.summary || "Senior Engineer Available"}
                    </span>
                  </div>
                </motion.div>

                {/* Professional Typography - Enhanced Mobile Scaling */}
                <div className="mb-6 md:mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="responsive-heading-hero font-heading font-black tracking-[-0.05em] leading-[0.95] text-foreground mb-4"
                  >
                    <span className="block opacity-90">{titleLine1}</span>
                    <span className="text-gradient relative inline-block pb-2">
                      {titleLine2}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="absolute bottom-1 left-0 h-1 md:h-2 bg-primary/20 dark:bg-primary/10 rounded-full"
                      />
                    </span>
                  </motion.h1>
                </div>

                {/* Balanced Description - Improved Mobile Readability */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="responsive-text-body text-muted-foreground dark:text-muted-foreground/70 font-medium mb-8 md:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-tight"
                >
                  {homeContent?.description ||
                    "Building high-performance, user-centric digital ecosystems with technical excellence and industrial precision."}
                </motion.p>

                {/* Compact CTAs - Enhanced Mobile Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 md:gap-6 mb-8 md:mb-12"
                >
                  <div className="flex-1 sm:flex-initial">
                    <Button
                      size="lg"
                      onClick={handleHireClick}
                      disabled={isHiring || hired}
                      className={`relative overflow-hidden w-full sm:w-auto h-12 md:h-14 px-8 md:px-12 rounded-2xl text-lg font-bold tracking-tight shadow-xl transition-all duration-300 group cursor-pointer ${
                        hired 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" 
                          : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30"
                      } active:scale-95 focus-ring`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 4, opacity: 1, transition: { duration: 0.4 } }}
                        style={{ originX: "50%", originY: "50%", borderRadius: "100%" }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        {isHiring ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : hired ? (
                          <>
                            <Check className="w-5 h-5 mr-2 animate-bounce" />
                            Lets Go!
                          </>
                        ) : (
                          <>
                            Hire Me
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                  <Link
                    to="/projects"
                    className="flex-1 sm:flex-initial group flex items-center justify-center gap-3 text-lg font-bold tracking-tight text-foreground/70 hover:text-primary transition-all duration-300 cursor-pointer border border-primary/20 hover:border-primary/50 rounded-2xl py-3 md:py-4 px-6 md:px-8 lg:border-0 lg:py-0 lg:px-0 lg:justify-start touch-target"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300 group-hover:scale-110">
                      <MousePointer2 className="w-4 h-4" />
                    </div>
                    <span className="sm:inline">Portfolio</span>
                  </Link>
                </motion.div>

                {/* Footer Info - Enhanced Mobile Structure */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center lg:items-center gap-6 md:gap-10 pt-6 md:pt-8 border-t border-primary/5 dark:border-white/5"
                >
                  <div className="flex items-center gap-3 md:gap-4 group cursor-default order-2 sm:order-1">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors touch-target">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] md:text-[8px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground mb-0.5">
                        Location
                      </div>
                      <div className="text-sm md:text-[13px] font-bold tracking-tight text-foreground">
                        {homeContent?.location || "Remote / Global"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 order-1 sm:order-2">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2, scale: 1.05 }}
                        className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-primary/10 dark:border-white/10 transition-all duration-300 shadow-xl shadow-primary/5 ${social.color} touch-target focus-ring`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Section - Advanced Build & Launch Background System */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4,
              }}
              className="relative flex justify-center lg:justify-end order-2 lg:order-2 mb-16 sm:mb-20 lg:mb-0"
            >
              <div className="relative w-full max-w-[280px] xs:max-w-sm sm:max-w-md lg:max-w-lg aspect-square lg:aspect-auto lg:w-full lg:max-w-[420px] lg:aspect-square group/hero-right">
                {/* Advanced Dynamic Gradient System */}
                <div className="absolute inset-[-15px] xs:inset-[-20px] lg:inset-[-40px] z-0">
                  {/* Primary Glow */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                      opacity: [0.3, 0.5, 0.3] 
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-[3rem] xs:rounded-[4rem] blur-[40px] xs:blur-[60px] lg:blur-[100px] transition-all duration-[400ms] ease-in-out"
                  />
                  {/* Accent Glow */}
                  <motion.div
                    animate={{ 
                      scale: [1.1, 1, 1.1],
                      rotate: [0, -5, 0],
                      opacity: [0.2, 0.4, 0.2] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-accent/5 to-transparent rounded-[3rem] xs:rounded-[4rem] blur-[30px] xs:blur-[50px] lg:blur-[80px] transition-all duration-[400ms] ease-in-out"
                  />
                  {/* Theme-Aware Layered Grids */}
                   <div className="absolute inset-0 opacity-[0.1] md:opacity-[0.15] dark:opacity-[0.08] bg-[linear-gradient(to_right,theme(colors.primary/10%)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.primary/10%)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] transition-opacity duration-[400ms]" />
                 </div>

                <motion.div
                  whileHover={{ rotate: -1, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative h-full w-full rounded-[2.5rem] xs:rounded-[3rem] lg:rounded-[4rem] border-[6px] md:border-[8px] lg:border-[12px] border-white dark:border-background shadow-2xl z-10 isolation-isolate"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
                    <ImageWithFallback
                      src={homeContent?.profile_pic || ""}
                      alt={homeContent?.name || "Professional Profile"}
                      className="img-responsive grayscale-[0.1] group-hover/hero-right:grayscale-0 transition-all duration-1000 scale-100 group-hover/hero-right:scale-110 rounded-[inherit]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover/hero-right:opacity-40" />
                  </div>

                  {/* Enhanced Polaroid Section */}
                  <div className="absolute inset-x-0 bottom-0 z-30 transform translate-y-0 sm:translate-y-1/4">
                    <PolaroidFrames 
                      name={homeContent?.name} 
                      position={homeContent?.position} 
                    />
                  </div>
                </motion.div>

                {/* New Floating Rocket Element - Bottom Left */}
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    x: [0, 4, 0] 
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute -bottom-4 -left-4 xs:-bottom-6 xs:-left-6 sm:-bottom-8 sm:-left-8 z-30 group/rocket"
                >
                  <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                    {/* Moving Transparent Circle Background */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: 360,
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ 
                        duration: 10, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="absolute inset-0 rounded-full border border-dashed border-accent/40 bg-accent/5 backdrop-blur-[2px]"
                    />
                    
                    {/* Pulsing Outer Glow */}
                    <motion.div
                      animate={{ 
                        scale: [0.8, 1.4, 0.8],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="absolute inset-0 rounded-full bg-accent/20 blur-lg xs:blur-xl"
                    />

                    {/* Rocket Icon Container */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: -15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRocketClick}
                      className="relative w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-background/80 dark:bg-black/80 backdrop-blur-md border border-accent/30 shadow-lg shadow-accent/10 group-hover/rocket:border-accent group-hover/rocket:shadow-accent/30 transition-all duration-300 touch-target focus-ring cursor-pointer"
                    >
                      <Rocket className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-accent animate-bounce" />
                    </motion.div>

                    {/* Innovation Indicator */}
                    <div className="absolute top-0 right-0 w-2 xs:w-3 h-2 xs:h-3 bg-accent rounded-full border-2 border-white dark:border-black animate-pulse" />
                  </div>
                </motion.div>
              </div>

              {/* Compact Dynamic Stats */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    whileHover={{ x: -8, scale: 1.05 }}
                    className="glass px-5 py-3 rounded-xl flex items-center gap-4 min-w-[180px] border-white/10 shadow-lg group"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center group-hover:rotate-6 transition-transform`}
                    >
                      <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-base font-black leading-none mb-0.5 tracking-tighter">
                        {stat.value}
                      </div>
                      <div className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimalist Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary/30 to-transparent rounded-full relative overflow-hidden">
            <motion.div
              animate={{ top: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-1/2 bg-primary/40"
            />
          </div>
        </motion.div>
      </section>

      {/* Tech & Features Section - Dynamic creations from Dashboard */}
      <section
        id="features"
        className="responsive-section bg-muted/30 dark:bg-muted/5 border-y border-primary/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500"
      >
        <div className="relative z-10">
          <header className="text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <div
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 dark:bg-primary/[0.03] text-primary/80 dark:text-primary/60 text-[9px] font-bold uppercase tracking-[0.1em] mb-4 border border-primary/10 dark:border-white/10 backdrop-blur-sm shadow-sm w-fit mx-auto"
              >
                <Sparkles className="w-2.5 h-2.5" />
                Industrial Features
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-heading tracking-tighter text-foreground">
              Engineering <span className="text-gradient">Excellence</span>
            </h2>
            <p className="responsive-text-body text-muted-foreground dark:text-muted-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
              Dynamically surfaced creation points showcasing high-fidelity
              technical implementation and scalable architecture.
            </p>
          </header>

          <div className="fluid-grid">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white dark:bg-card/40 backdrop-blur-3xl border-primary/5 dark:border-white/5 hover:border-primary/20 transition-all duration-500 rounded-2xl lg:rounded-3xl overflow-hidden group shadow-xl shadow-primary/[0.02]">
                  <CardContent className="p-8 lg:p-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-primary/5 dark:bg-muted/30 flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-inner">
                      <feature.icon
                        className={`w-6 h-6 lg:w-8 lg:h-8 ${feature.color}`}
                      />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground dark:text-muted-foreground/80 font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="responsive-section relative overflow-hidden"
        aria-label="Tech Stack"
      >
        <div className="">
          <header className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 font-heading tracking-tighter text-foreground">
              The <span className="text-gradient">Tech</span> Core
            </h2>
            <p className="responsive-text-body text-muted-foreground dark:text-muted-foreground/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Mastering modern technologies to architect high-performance
              digital systems.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 max-w-5xl mx-auto">
            {skills.map((skill: string, index: number) => (
              <motion.div
                key={`${skill}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-card/40 backdrop-blur-3xl border border-primary/10 dark:border-white/5 shadow-sm hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 flex items-center gap-2.5 group touch-target">
                  <Terminal className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="text-xs lg:text-sm font-bold text-foreground/70 group-hover:text-primary transition-colors tracking-tight uppercase">
                    {skill}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="responsive-section"
        aria-label="Portfolio Projects"
      >
        <div className="">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-12">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-7xl font-black mb-6 font-heading tracking-tighter leading-none text-foreground">
                Featured <br /> <span className="text-gradient">Creations</span>
              </h2>
              <p className="responsive-text-body text-muted-foreground dark:text-muted-foreground/70 font-medium leading-relaxed">
                Showcasing excellence where complex problems meet elegant
                engineering solutions.
              </p>
            </div>
            <Link to="/projects">
              <Button
                variant="outline"
                className="w-full sm:w-[220px] h-14 rounded-2xl border border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-500 font-bold text-base tracking-tight shadow-lg shadow-primary/5 group cursor-pointer touch-target focus-ring"
              >
                Case Studies{" "}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
            {featuredProjects.map((project: any, index: number) => (
              <article key={project?.id || index} className="group h-full perspective-1000">
                <Card className="relative overflow-hidden border-primary/5 dark:border-white/5 shadow-2xl transition-all duration-700 bg-white/80 dark:bg-card/30 backdrop-blur-3xl rounded-[2rem] lg:rounded-[2.5rem] h-full flex flex-col hover:shadow-primary/20 hover:-translate-y-2">
                  {/* Decorative Background Glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="aspect-video overflow-hidden relative isolation-isolate rounded-t-[inherit]">
                    <ImageWithFallback
                      src={project?.image || ""}
                      alt={project?.title || "Project case study"}
                      className="img-responsive transition-transform duration-[1.5s] ease-out group-hover:scale-110 rounded-t-[inherit]"
                    />
                    
                    {/* Floating Live Badge - Smaller */}
                    <div className="absolute top-4 right-4 z-20">
                      <motion.a
                        href={project?.live_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-colors touch-target focus-ring"
                      >
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        Live
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </motion.a>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-700 flex items-end p-6 lg:p-8">
                      <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                        <Badge className="bg-primary/20 backdrop-blur-xl border-primary/30 text-white font-bold px-3 py-1 rounded-lg mb-3 uppercase tracking-[0.2em] text-[8px]">
                          {project?.category || "Industrial"}
                        </Badge>
                        <h3 className="text-xl lg:text-3xl font-black tracking-tighter leading-tight">
                          {project?.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8 lg:p-10 flex-grow flex flex-col">
                    <p className="responsive-text-body text-muted-foreground dark:text-muted-foreground/80 mb-6 lg:mb-8 leading-relaxed font-medium">
                      {project?.description ||
                        "High-performance technical solution built with precision and modern best practices."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {(Array.isArray(project?.technologies) ? project.technologies : [])
                        .slice(0, 4)
                        .map((tech: string) => (
                          <span
                            key={tech}
                            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-primary/5 text-primary/70 border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-500"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-primary/5 dark:border-white/10 flex items-center justify-between">
                      <Link
                        to={`/projects/${project?.id}`}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-3 transition-all duration-300 touch-target focus-ring"
                      >
                        Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex gap-3">
                        <a
                          href={project?.github_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-white transition-all duration-500 touch-target focus-ring"
                          title="View Source"
                        >
                          <Code className="w-4 h-4" />
                        </a>
                        <a
                          href={project?.live_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-500 touch-target focus-ring"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="blog"
        className="responsive-section bg-muted/20 dark:bg-card/20 border-y border-border/50"
        aria-label="Latest Articles"
      >
        <div className="">
          <header className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-heading tracking-tighter text-foreground">
              Latest <span className="text-gradient">Insights</span>
            </h2>
            <p className="responsive-text-body text-muted-foreground dark:text-muted-foreground/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Analyzing the future of digital engineering and technical
              architecture.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-24">
            {featuredPosts.map((post: any, index: number) => (
              <article key={post?.id || index} className="group h-full">
                <Card className="h-full flex flex-col overflow-hidden border-primary/5 dark:border-white/5 shadow-2xl hover:shadow-primary/10 transition-all duration-700 bg-white dark:bg-card/40 backdrop-blur-3xl rounded-[2rem] lg:rounded-[3rem]">
                  <div className="aspect-video overflow-hidden relative isolation-isolate rounded-[inherit]">
                    <ImageWithFallback
                      src={post?.image || ""}
                      alt={post?.title || "Blog post"}
                      className="w-full h-full object-cover transition-transform duration-1200 group-hover:scale-110 rounded-[inherit]"
                    />
                  </div>
                  <CardContent className="p-6 lg:p-10 flex-grow flex flex-col">
                    <div className="text-xs lg:text-[11px] font-bold text-primary mb-6 lg:mb-8 uppercase tracking-[0.3em] lg:tracking-[0.5em] flex items-center gap-2 lg:gap-3">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-primary shadow-glow" />
                      {post?.createdAt
                        ? new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "RECENT"}
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 font-heading group-hover:text-primary transition-colors line-clamp-2 tracking-tighter leading-tight text-foreground">
                      {post?.title || "Technical Insights"}
                    </h3>
                    <p className="text-sm lg:text-base xl:text-lg text-muted-foreground dark:text-muted-foreground/80 mb-8 lg:mb-12 font-medium line-clamp-3 leading-relaxed flex-grow">
                      {post?.content
                        ? post.content.substring(0, 100) + "..."
                        : "Exploring the nuances of modern software engineering and architecture."}
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-bold text-xs lg:text-[11px] uppercase tracking-[0.3em] lg:tracking-[0.4em] flex items-center gap-4 lg:gap-6 group/btn hover:bg-transparent text-primary cursor-pointer"
                    >
                      Read More
                      <div className="w-8 h-[2px] lg:w-12 lg:h-[3px] bg-primary/20 group-hover/btn:w-12 lg:group-hover/btn:w-20 group-hover/btn:bg-primary transition-all duration-700 rounded-full" />
                    </Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link to="/blog">
              <Button
                variant="outline"
                className="w-full sm:w-[220px] h-14 rounded-2xl border border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all duration-500 font-bold text-base tracking-tight shadow-lg shadow-primary/5 cursor-pointer"
              >
                The Library
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
