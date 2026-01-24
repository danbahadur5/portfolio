"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Download,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Code,
  Zap,
  Star,
  Users,
  Tag,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { contentData } from "../../data/content";
import { projectsData } from "../../data/projects";
import { blogData } from "../../data/blog";
import { LoadingSpinner } from "../LoadingSpinner";
import axios from "axios";
import { Link } from "react-router-dom";

type Personal = {
  name?: string;
  position?: string;
  summary?: string;
  description?: string;
  profile_pic?: string;
  avatar?: string;
  social?: { github?: string; linkedin?: string; twitter?: string };
  location?: string;
  skills?: string[];
};

export function HomePage() {
  const defaultPersonal: Personal = {
    name: "",
    position: "",
    summary: "",
    description: "",
    profile_pic: "",
    avatar: "",
    social: { github: "#", linkedin: "#", twitter: "#" },
    location: "",
    skills: [],
  };

  const [isLoading, setIsLoading] = useState(true);
  const [personal, setPersonal] = useState<Personal>(
    (contentData?.personal as Personal) ?? defaultPersonal
  );
  const [skills, setSkills] = useState<string[]>(
    (contentData?.skills as string[]) ?? []
  );

  const [projectResponse, setProjectResponse] = useState<any>({});
  const [blogResponse, setBlogResponse] = useState<any>({});

  const [contactInfo, setContactInfo] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const backend = import.meta.env.VITE_BACKEND_URL;
        if (!backend) {
          console.warn("VITE_BACKEND_URL is not defined — skipping fetch");
          setIsLoading(false);
          return;
        }

        const res = await axios.get(
          `${backend.replace(/\/$/, "")}/api/gethomecontent`,
          { signal: controller.signal }
        );
        const projectResponse = await axios.get(
          `${backend.replace(/\/$/, "")}/api/getallproject`,
          { signal: controller.signal }
        );
        const blogResponse = await axios.get(
          `${backend.replace(/\/$/, "")}/api/getblogs`,
          { signal: controller.signal }
        );
        const contactResponse = await axios.get(
            `${backend.replace(/\/$/, "")}/api/getcontact`,
            { signal: controller.signal }
        );

        if (mounted) {
          setProjectResponse(projectResponse?.data?.projects ?? {});
          setBlogResponse(blogResponse?.data?.blogs ?? {});
          if (contactResponse?.data?.contacts?.[0]) {
            setContactInfo(contactResponse.data.contacts[0]);
          }

          const newHome = res?.data?.homeContent?.[0];
          if (newHome) {
            setPersonal((prev: Personal) => ({ ...prev, ...newHome }));
            if (Array.isArray(newHome.skills)) setSkills(newHome.skills);
          }
        }
      } catch (err: any) {
        if (axios.isCancel?.(err) || err?.name === "CanceledError") {
          // request was cancelled, ignore
        } else {
          console.error("Failed to fetch home content:", err);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchContent();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // safe featured arrays
  const featuredProjects = Array.isArray(projectResponse)
    ? (projectResponse as any[]).filter((p) => p?.featured === true).slice(0, 2)
    : [];

  const featuredPosts = Array.isArray(blogResponse)
    ? blogResponse.filter((p) => p?.featured === true).slice(0, 2)
    : [];

  // scroll/motion
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const socialLinks = [
    {
      icon: Github,
      href: contactInfo?.github_profile || personal?.social?.github || "#",
      label: "GitHub",
      color: "hover:text-purple-500",
    },
    {
      icon: Linkedin,
      href: contactInfo?.linkedin_profile || personal?.social?.linkedin || "#",
      label: "LinkedIn",
      color: "hover:text-blue-500",
    },
    {
      icon: Twitter,
      href: contactInfo?.twitter_profile || personal?.social?.twitter || "#",
      label: "Twitter",
      color: "hover:text-sky-500",
    },
  ];

  const stats = [
    {
      icon: Code,
      value: `${projectResponse?.length}+` || "0",
      label: "Projects Built",
      color: "text-blue-500",
    },
    {
      icon: Users,
      value: "10+",
      label: "Happy Clients",
      color: "text-green-500",
    },
    {
      icon: Star,
      value: "3+",
      label: "Years Experience",
      color: "text-yellow-500",
    },
    {
      icon: Zap,
      value: "100%",
      label: "Client Satisfaction",
      color: "text-purple-500",
    },
  ];

  const nameParts = personal?.name ? personal.name.split(" ") : ["", ""];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-blue-600/20 rounded-full blur-3xl"
            animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 0.8, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-400/15 to-yellow-500/15 rounded-full blur-3xl"
            animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Mouse follower */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none"
            animate={{ x: mousePosition.x - 192, y: mousePosition.y - 192 }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
          />
        </div>

        {/* Content */}
        <motion.div
          style={{ y: y1, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Badge
                  variant="secondary"
                  className="mb-6 py-2 px-4 text-sm bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Available for new projects
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6">
                  <span className="block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                    {nameParts[0] || ""}
                  </span>
                  <span className="block text-muted-foreground">
                    {nameParts.slice(1).join(" ") || ""}
                  </span>
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-4"
                >
                  <span className="block">{personal?.position || ""}</span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg sm:text-xl text-muted-foreground/80 italic"
                >
                  "{personal?.summary || ""}"
                </motion.p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl lg:max-w-none"
              >
                {personal?.description || ""}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link to={"/projects"}>
                  <Button
                    size="lg"
                    className="group cursor-pointer bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    aria-label="View my work"
                  >
                    <span className="mr-2">View My Work</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <a
                  href="https://drive.google.com/file/d/1NHSWuOmVw2qwvFpJRB6UAcWfistIUtw9/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  // Note: `download` won't force download for cross-origin URLs (browser limitation)
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg cursor-pointer px-8 py-6 rounded-2xl border-2 hover:bg-accent/50 transition-all duration-300"
                    aria-label="Download CV"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download CV
                  </Button>
                </a>
              </motion.div>

              {/* Location & Social */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <div
                  className="flex items-center text-muted-foreground"
                  aria-hidden
                >
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-base">{personal?.location || ""}</span>
                </div>

                <div
                  className="flex items-center gap-4"
                  role="navigation"
                  aria-label="Social links"
                >
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 bg-muted/50 hover:bg-accent rounded-xl transition-all duration-300 ${social.color}`}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Avatar & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative flex flex-col items-center lg:items-end"
            >
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative mb-8"
              >
                <div className="relative">
                  {/* Rotating ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 w-80 h-80 sm:w-96 sm:h-96 border-4 border-primary/20 rounded-full"
                  />

                  {/* Glow effect */}
                  <div className="absolute inset-0 w-80 h-80 sm:w-96 sm:h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse" />

                  {/* Avatar image */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative z-10"
                  >
                    <ImageWithFallback
                      src={personal?.profile_pic || personal?.avatar || ""}
                      alt={personal?.name || "Profile image"}
                      className="w-80 h-80 sm:w-96 sm:h-96 rounded-full object-cover border-4 border-background shadow-2xl"
                    />
                  </motion.div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    aria-hidden
                  >
                    ⚡ Available
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    aria-hidden
                  >
                    🚀 Fast Delivery
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-2 gap-4 w-full max-w-md"
              >
                {stats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <Card className="text-center p-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-all duration-300">
                        <CardContent className="p-0">
                          <StatIcon
                            className={`w-6 h-6 mx-auto mb-2 ${stat.color}`}
                          />
                          <div className="text-2xl font-bold mb-1">
                            {stat.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-muted-foreground"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Skills & Technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              I work with modern technologies to build scalable and performant
              applications
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {Array.isArray(skills) && skills.length > 0 ? (
              skills.map((skill, index) => (
                <motion.div
                  key={`${skill}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-base py-3 px-6 bg-card hover:bg-accent transition-all duration-300 cursor-default shadow-sm hover:shadow-md"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="text-muted-foreground">No skills listed yet.</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Some of my recent work that I'm proud to share
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {featuredProjects.map((project: any, index: number) => {
              const techs = Array.isArray(project?.technologies)
                ? project.technologies
                : [];
              return (
                <motion.div
                  key={project?.id ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
                    <div className="aspect-video overflow-hidden relative">
                      <ImageWithFallback
                        src={project?.image ?? ""}
                        alt={project?.title ?? "Project image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="text-sm">
                          {project?.category ?? "Project"}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Featured
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {project?.title ?? "Untitled"}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {project?.description ?? ""}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {techs.slice(0, 3).map((tech: string) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-sm"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {techs.length > 3 && (
                          <Badge variant="outline" className="text-sm">
                            +{techs.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto text-primary hover:bg-transparent"
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to={"/projects"}>
              <Button
                variant="outline"
                size="lg"
                className="group text-lg px-8 py-6 rounded-2xl border-2 hover:bg-primary hover:text-red-400 transition-all duration-300"
              >
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Latest Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Thoughts and learnings from my journey in tech
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {featuredPosts.map((post: any, index: number) => {
              const tags = Array.isArray(post?.tags) ? post.tags : [];
              return (
                <motion.div
                  key={post?.id ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm">
                    <div className="aspect-video overflow-hidden relative">
                      <ImageWithFallback
                        src={post?.image ?? ""}
                        alt={post?.title ?? "Post image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span>
                          {post?.createdAt
                            ? new Date(post.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{post?.readTime ?? ""}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post?.title ?? "Untitled"}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {post?.excerpt ?? ""}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.slice(0, 3).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-sm"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto text-primary hover:bg-transparent"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to={"/blog"}>
              <Button
                variant="outline"
                size="lg"
                className="group text-lg px-8 py-6 rounded-2xl border-2 hover:bg-primary hover:text-red-400 transition-all duration-300"
              >
                Read All Posts
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
