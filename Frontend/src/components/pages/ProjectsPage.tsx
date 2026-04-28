import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Link,
  Rocket,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SearchFilter } from "../SearchFilter";
import { LoadingSpinner } from "../LoadingSpinner";
import { useProjects } from "@/hooks/useProjects";
import { Layout } from "../Layout";

export function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Get unique categories and technologies
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects?.map((p) => p.category) || [])),
    ],
    [projects],
  );
  const technologies = useMemo(
    () =>
      Array.from(
        new Set(projects?.flatMap((p) => p.technologies || []) || []),
      ).sort(),
    [projects],
  );

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    let filtered = [...projects].filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;
      const matchesTech =
        selectedTech.length === 0 ||
        selectedTech.every((tech) => (project.technologies || []).includes(tech));

      return matchesSearch && matchesCategory && matchesTech;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
          );
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, selectedCategory, selectedTech, sortBy]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (isLoading && projects.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-20 overflow-hidden" aria-label="Projects Introduction">
        {/* Background Decorative Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[15%] left-[-2%] whitespace-nowrap"
          >
            <span className="text-[15vw] font-black text-primary/[0.03] dark:text-primary/[0.02] uppercase tracking-tighter leading-none select-none">
              Projects
            </span>
          </motion.div>
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-primary/10 dark:bg-primary/[0.05] rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-accent/10 dark:bg-accent/[0.03] rounded-full blur-[80px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 dark:bg-primary/[0.05] border border-primary/10 dark:border-white/10 backdrop-blur-md shadow-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full rounded-full bg-primary/40 animate-ping" />
                <span className="relative h-full w-full rounded-full bg-primary" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary/80 dark:text-primary/70">
                Engineering Showcase
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-[-0.05em] leading-[0.9] text-foreground mb-8 text-balance">
              Selected <span className="text-gradient">Projects</span>
            </h1>
            
            <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-16 text-pretty">
              A curated showcase of <span className="text-foreground font-bold">engineering excellence</span>, combining high-performance technical solutions with <span className="text-foreground font-bold">exceptional user experiences</span>.
            </p>

            <div className="max-w-4xl mx-auto">
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
                selectedTech={selectedTech}
                onTechChange={setSelectedTech}
                technologies={technologies}
                placeholder="Search projects..."
                className="mb-8"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="responsive-section pt-0 -mt-8" aria-label="Projects Listing">
        <div className="responsive-container">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid-portfolio"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project._id || project.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group h-full"
                >
                  <Card className="relative overflow-hidden border-primary/5 dark:border-white/5 shadow-2xl transition-all duration-700 bg-white/80 dark:bg-card/30 backdrop-blur-3xl rounded-[1.5rem] sm:rounded-[2rem] h-full flex flex-col hover-lift group/project-card">
                    {/* Decorative Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover/project-card:opacity-100 transition-opacity duration-700" />
                    
                    <div className="aspect-[16/10] overflow-hidden relative isolation-isolate rounded-t-[inherit]">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="img-responsive transition-transform duration-[1.5s] ease-out group-hover/project-card:scale-110"
                      />
                      
                      {/* Floating Live Badge */}
                      <div className="absolute top-4 right-4 z-20">
                        {project.liveUrl && (
                          <motion.a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-colors touch-target focus-ring"
                          >
                            <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                          </motion.a>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 group-hover/project-card:opacity-80 transition-all duration-700 flex items-end p-4 lg:p-6">
                        <div className="text-white transform translate-y-2 group-hover/project-card:translate-y-0 transition-transform duration-700">
                          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary mb-1.5 block">
                            {project.category}
                          </span>
                          <h3 className="text-lg lg:text-xl xl:text-2xl font-black tracking-tighter leading-tight">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5 flex-grow flex flex-col">
                      <p className="text-sm lg:text-base text-muted-foreground dark:text-muted-foreground/80 mb-6 leading-relaxed font-medium line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                        {(project.technologies || []).slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-primary/5 text-primary/70 border border-primary/10 group-hover/project-card:border-primary/30 group-hover/project-card:bg-primary/10 transition-all duration-500"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-primary/5 dark:border-white/10 flex items-center justify-between">
                        <div className="flex gap-4">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-3 transition-all duration-300 touch-target focus-ring"
                            >
                              Live <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.sourceUrl && (
                            <a
                              href={project.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all duration-300 touch-target focus-ring"
                            >
                              Code <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
