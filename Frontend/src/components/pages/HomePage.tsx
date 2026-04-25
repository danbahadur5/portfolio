"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Terminal,
  Globe,
  Briefcase,
  Trophy,
  Rocket,
  MousePointer2,
  Cpu,
  Layers,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { LoadingSpinner } from "../LoadingSpinner";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { useBlogs } from "../../hooks/useBlogs";
import { useSkills } from "../../hooks/useSkills";
import { useHomeContent } from "../../hooks/useHomeContent";
import { useContact } from "../../hooks/useContact";

export function HomePage() {
  const { data: homeContent, isLoading: isHomeLoading } = useHomeContent();
  const { projects, isLoading: isProjectsLoading } = useProjects();
  const { blogs, isLoading: isBlogsLoading } = useBlogs();
  const { skills: skillsData, isLoading: isSkillsLoading } = useSkills();
  const { data: contactInfo, isLoading: isContactLoading } = useContact();

  const { scrollY } = useScroll();

  // Professional fluidity: Optimized scroll transformations
  // Smoother transition with subtle scale and blur for high-end feel
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.96]);
  const heroBlur = useTransform(scrollY, [0, 400], [0, 10]);
  const contentY = useTransform(scrollY, [0, 400], [0, 60]);
  const bgTextX = useTransform(scrollY, [0, 1000], [0, -150]);

  const isLoading =
    isHomeLoading ||
    isProjectsLoading ||
    isBlogsLoading ||
    isSkillsLoading ||
    isContactLoading;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        aria-busy="true"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const featuredProjects = projects?.slice(0, 2) || [];
  const featuredPosts = blogs?.slice(0, 3) || [];
  const skills = Array.isArray(skillsData?.skills)
    ? skillsData.skills
    : typeof skillsData?.skills === "string"
      ? skillsData.skills.split(",").map((s: string) => s.trim())
      : [];

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
    <main
      className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden"
      id="main-content"
    >
      {/* Hero Section - Compact & Professional Layout */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 md:pt-24 lg:pt-24"
        aria-label="Introduction"
      >
        {/* Background Decorative Layer - Enhanced for both modes */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            style={{ x: bgTextX }}
            className="absolute top-[15%] left-[-2%] whitespace-nowrap"
          >
            <span className="text-[12vw] font-black text-primary/[0.03] dark:text-primary/[0.02] uppercase tracking-tighter leading-none select-none">
              {homeContent?.name || "Portfolio"}
            </span>
          </motion.div>

          {/* Animated Mesh Gradients for Light Mode Vibrancy */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 dark:bg-primary/[0.02] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 dark:bg-accent/[0.01] rounded-full blur-[100px] animate-pulse delay-700" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-foreground)_1px,transparent_1px)] bg-[size:32px:32px] opacity-[0.05] dark:opacity-[0.02]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <motion.div
            style={{
              opacity: heroOpacity,
              scale: heroScale,
              y: contentY,
              filter: `blur(${heroBlur}px)`,
            }}
            className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 xl:gap-24 items-center"
          >
            {/* Left Content - Improved Mobile Layout */}
            <div className="relative order-2 lg:order-1">
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
                  className="mb-6 lg:mb-8"
                >
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-2xl bg-white/40 dark:bg-white/5 border border-primary/10 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-primary/5 group">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute h-full w-full rounded-full bg-primary/40 animate-ping" />
                      <span className="relative h-full w-full rounded-full bg-primary" />
                    </span>
                    <span className="text-xs sm:text-[9px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-foreground/70 dark:text-foreground/50">
                      {homeContent?.summary || "Senior Engineer Available"}
                    </span>
                  </div>
                </motion.div>

                {/* Professional Typography - Enhanced Mobile Scaling */}
                <div className="mb-6 lg:mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-[clamp(2.5rem,8vw,5rem)] lg:text-[clamp(2.5rem,6vw,5rem)] font-heading font-black tracking-[-0.05em] leading-[0.95] text-foreground mb-4"
                  >
                    <span className="block opacity-90">{titleLine1}</span>
                    <span className="text-gradient relative inline-block pb-2">
                      {titleLine2}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="absolute bottom-1 left-0 h-1 bg-primary/20 dark:bg-primary/10 rounded-full"
                      />
                    </span>
                  </motion.h1>
                </div>

                {/* Balanced Description - Improved Mobile Readability */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-base sm:text-lg lg:text-base xl:text-lg text-muted-foreground dark:text-muted-foreground/70 font-medium mb-8 lg:mb-10 max-w-xl leading-relaxed tracking-tight"
                >
                  {homeContent?.description ||
                    "Building high-performance, user-centric digital ecosystems with technical excellence and industrial precision."}
                </motion.p>

                {/* Compact CTAs - Enhanced Mobile Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6 mb-8 lg:mb-12"
                >
                  <Link to="/contact" className="flex-1 sm:flex-initial">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-12 lg:h-14 px-6 lg:px-10 rounded-2xl text-base font-bold shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                    >
                      Hire Me{" "}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex-1 sm:flex-initial group flex items-center justify-center gap-3 text-base font-bold tracking-tight text-foreground/60 hover:text-primary transition-colors cursor-pointer border border-primary/20 rounded-2xl py-3 lg:py-0 lg:border-0 lg:justify-start hover:border-primary/40"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-primary/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                      <MousePointer2 className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline">Portfolio</span>
                  </Link>
                </motion.div>

                {/* Footer Info - Enhanced Mobile Structure */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-10 pt-6 lg:pt-8 border-t border-primary/5 dark:border-white/5"
                >
                  <div className="flex items-center gap-3 lg:gap-4 group cursor-default order-2 sm:order-1">
                    <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs lg:text-[8px] font-bold uppercase tracking-[0.3em] lg:tracking-[0.4em] text-muted-foreground mb-0.5">
                        Location
                      </div>
                      <div className="text-sm lg:text-[13px] font-bold tracking-tight text-foreground">
                        {homeContent?.location || "Remote / Global"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 order-1 sm:order-2">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2, scale: 1.05 }}
                        className={`w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-primary/10 dark:border-white/10 transition-all duration-300 shadow-xl shadow-primary/5 ${social.color}`}
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Section - Enhanced Mobile Responsiveness */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4,
              }}
              className="relative flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square lg:aspect-auto lg:w-full lg:max-w-[420px] lg:aspect-square">
                {/* Geometric Decorative Layers - Optimized for Mobile */}
                <div className="absolute inset-[-15px] lg:inset-[-20px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] lg:rounded-[4rem] rotate-3 lg:rotate-6 scale-95 blur-2xl lg:blur-3xl opacity-30 dark:opacity-15 animate-pulse" />

                <motion.div
                  whileHover={{ rotate: -1, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative h-full w-full rounded-[3rem] lg:rounded-[4rem] overflow-hidden border-[8px] lg:border-[12px] border-white dark:border-background shadow-2xl group"
                >
                  <ImageWithFallback
                    src={homeContent?.profile_pic || ""}
                    alt={homeContent?.name || "Professional Profile"}
                    className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                  {/* Identity Badge Overlay - Mobile Optimized */}
                  <div className="absolute bottom-6 lg:bottom-8 left-6 lg:left-8 right-6 lg:right-8">
                    <div className="glass p-4 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] border-white/30 dark:border-white/20 shadow-2xl backdrop-blur-3xl">
                      <div className="text-white font-bold text-xl lg:text-2xl tracking-tighter mb-1">
                        {homeContent?.name || "The Engineer"}
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold text-xs lg:text-[9px] uppercase tracking-[0.2em] lg:tracking-[0.3em]">
                        <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 animate-pulse" />{" "}
                        {homeContent?.position || "Full-Stack Architect"}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Floating Icons - Mobile Optimized */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 lg:-top-4 lg:-right-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center shadow-xl border-white/20 group hover:border-primary/50 cursor-pointer backdrop-blur-3xl z-20"
                >
                  <Terminal className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary mb-0.5 lg:mb-1 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]" />
                  <span className="text-[6px] sm:text-[7px] lg:text-[8px] xl:text-[9px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-primary/60">
                    Build
                  </span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 lg:-bottom-4 lg:-left-4 w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center shadow-xl border-white/20 group hover:border-accent/50 cursor-pointer backdrop-blur-3xl z-20"
                >
                  <Rocket className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 text-accent mb-0.5 lg:mb-1 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(var(--accent),0.3)]" />
                  <span className="text-[6px] sm:text-[7px] lg:text-[8px] xl:text-[9px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-accent/60">
                    Launch
                  </span>
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
          style={{ opacity: heroOpacity }}
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
        className="py-24 md:py-32 px-6 bg-muted/30 dark:bg-muted/5 border-y border-primary/5 dark:border-white/5 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <header className="text-center mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Badge
                variant="outline"
                className="px-5 py-2 rounded-full border-primary/20 text-primary bg-primary/5 font-black uppercase tracking-[0.4em] text-[10px]"
              >
                Industrial Features
              </Badge>
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-heading tracking-tighter text-foreground">
              Engineering <span className="text-gradient">Excellence</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
              Dynamically surfaced creation points showcasing high-fidelity
              technical implementation and scalable architecture.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                  <CardContent className="p-6 lg:p-10 flex flex-col items-center text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-primary/5 dark:bg-muted/30 flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-inner">
                      <feature.icon
                        className={`w-6 h-6 lg:w-8 lg:h-8 ${feature.color}`}
                      />
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground dark:text-muted-foreground/80 text-sm font-medium leading-relaxed">
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
        className="py-24 md:py-32 px-6 relative overflow-hidden"
        aria-label="Tech Stack"
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-heading tracking-tighter text-foreground">
              The <span className="text-gradient">Tech</span> Core
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
              Mastering modern technologies to architect high-performance
              digital systems.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 max-w-6xl mx-auto">
            {skills.map((skill: string, index: number) => (
              <motion.div
                key={`${skill}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ y: -3, scale: 1.05 }}
              >
                <div className="px-4 lg:px-8 py-3 lg:py-5 rounded-xl lg:rounded-2xl bg-white dark:bg-card/40 backdrop-blur-3xl border border-primary/10 dark:border-white/5 shadow-xl shadow-primary/[0.02] hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 flex items-center gap-3 lg:gap-4 group">
                  <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all duration-500 shadow-glow" />
                  <span className="text-sm lg:text-base xl:text-lg font-bold text-foreground/80 group-hover:text-primary transition-colors tracking-tighter uppercase">
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
        className="py-24 md:py-32 px-6"
        aria-label="Portfolio Projects"
      >
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 gap-12">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-7xl font-black mb-6 font-heading tracking-tighter leading-none text-foreground">
                Featured <br /> <span className="text-gradient">Creations</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/70 font-medium leading-relaxed">
                Showcasing excellence where complex problems meet elegant
                engineering solutions.
              </p>
            </div>
            <Link to="/projects">
              <Button
                variant="outline"
                className="w-full sm:w-[220px] h-[64px] rounded-2xl border-2 border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-700 font-black text-lg group cursor-pointer shadow-xl shadow-primary/[0.05]"
              >
                Case Studies{" "}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </header>

          <div className="grid lg:grid-cols-2 gap-8 xl:gap-20">
            {featuredProjects.map((project: any, index: number) => (
              <article key={project?.id || index} className="group h-full">
                <Card className="overflow-hidden border-primary/5 dark:border-white/5 shadow-2xl transition-all duration-1000 bg-white dark:bg-card/40 backdrop-blur-3xl rounded-[2.5rem] lg:rounded-[3.5rem] h-full flex flex-col hover:shadow-primary/10">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <ImageWithFallback
                      src={project?.image || ""}
                      alt={project?.title || "Project case study"}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end p-6 lg:p-10 md:p-14">
                      <div className="text-white">
                        <Badge className="bg-primary/30 backdrop-blur-3xl border-primary/40 text-white font-bold px-4 lg:px-6 py-2 rounded-xl mb-4 lg:mb-6 uppercase tracking-[0.3em] lg:tracking-[0.5em] text-xs lg:text-[10px]">
                          Industrial Solution
                        </Badge>
                        <h3 className="text-2xl lg:text-4xl xl:text-5xl font-bold tracking-tighter leading-none">
                          {project?.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 lg:p-10 md:p-14 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-3 lg:gap-4 mb-6 lg:mb-8">
                      <Badge
                        variant="outline"
                        className="px-4 lg:px-6 py-2 rounded-full border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] text-xs lg:text-[10px]"
                      >
                        {project?.category || "Industrial"}
                      </Badge>
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl text-muted-foreground dark:text-muted-foreground/80 mb-8 lg:mb-12 leading-relaxed font-medium line-clamp-3">
                      {project?.description ||
                        "High-performance technical solution built with precision and modern best practices."}
                    </p>
                    <div className="flex flex-wrap gap-2 lg:gap-3 mt-auto pt-6 lg:pt-10 border-t border-primary/5 dark:border-white/10">
                      {(Array.isArray(project?.technologies)
                        ? project.technologies
                        : []
                      )
                        .slice(0, 5)
                        .map((tech: string) => (
                          <span
                            key={tech}
                            className="text-xs lg:text-[12px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] px-4 lg:px-6 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl bg-muted/50 dark:bg-muted/30 text-foreground/50 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700"
                          >
                            {tech}
                          </span>
                        ))}
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
        className="py-24 md:py-32 px-6 bg-muted/30 dark:bg-muted/5"
        aria-label="Latest Articles"
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-20 md:mb-32">
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-heading tracking-tighter text-foreground">
              Latest <span className="text-gradient">Insights</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/70 max-w-3xl mx-auto font-medium leading-relaxed">
              Analyzing the future of digital engineering and technical
              architecture.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-24">
            {featuredPosts.map((post: any, index: number) => (
              <article key={post?.id || index} className="group h-full">
                <Card className="h-full flex flex-col overflow-hidden border-primary/5 dark:border-white/5 shadow-2xl hover:shadow-primary/10 transition-all duration-700 bg-white dark:bg-card/40 backdrop-blur-3xl rounded-[2rem] lg:rounded-[3rem]">
                  <div className="aspect-video overflow-hidden relative">
                    <ImageWithFallback
                      src={post?.image || ""}
                      alt={post?.title || "Blog post"}
                      className="w-full h-full object-cover transition-transform duration-1200 group-hover:scale-110"
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
                className="w-full sm:w-[260px] h-[64px] rounded-full border-2 border-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-1000 font-black text-xl shadow-2xl cursor-pointer"
              >
                The Library
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
