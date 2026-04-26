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
      <section className="relative responsive-section overflow-hidden">
        {/* Background Decorative Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-accent/5 rounded-full blur-[80px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 responsive-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 dark:bg-primary/[0.03] text-primary/80 dark:text-primary/60 text-[9px] font-bold uppercase tracking-[0.1em] mb-6 border border-primary/10 dark:border-white/10 backdrop-blur-sm shadow-sm w-fit mx-auto">
               <Rocket className="w-2.5 h-2.5" />
               Engineering Showcase
             </div>
            <h1 className="responsive-heading-hero font-heading font-black tracking-tighter mb-6 leading-[0.95]">
              Selected <span className="text-gradient">Projects</span>
            </h1>
            <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16">
              A curated showcase of <span className="text-foreground font-bold">engineering excellence</span>, combining high-performance with <span className="text-foreground font-bold">intuitive design</span>.
            </p>
          </motion.div>

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
              className="mb-8 md:mb-12"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="responsive-section pt-0" aria-label="Projects Listing">
        <div className="responsive-container">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="fluid-grid"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project._id || project.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="overflow-hidden border border-border/50 bg-card/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 rounded-[2rem] lg:rounded-[2.5rem] h-full flex flex-col">
                    <div className="aspect-video overflow-hidden relative">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6 lg:p-8 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-3 lg:mb-4">
                        <span className="text-xs lg:text-[10px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] text-primary/60">
                          {project.category}
                        </span>
                        {project.featured && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 rounded-lg font-bold">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold font-heading mb-3 lg:mb-4 group-hover:text-primary transition-colors tracking-tight">
                        {project.title}
                      </h3>
                      <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed mb-6 lg:mb-8 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 mt-auto">
                        {(project.technologies || []).slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-lg bg-primary/5 text-[10px] lg:text-[11px] font-bold text-primary/70 uppercase tracking-wider border border-primary/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-4 lg:pt-6 border-t border-border/30">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all touch-target focus-ring rounded-lg px-2 -ml-2"
                            aria-label={`Launch live site for ${project.title}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                            Launch
                          </a>
                        )}
                        {project.sourceUrl && (
                          <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all touch-target focus-ring rounded-lg px-2"
                            aria-label={`View source code for ${project.title} on GitHub`}
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </a>
                        )}
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

function ProjectCard({ project }: { project: any }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group h-full"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm h-full flex flex-col">
        <div className="aspect-video overflow-hidden relative">
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {project.featured && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-sm">
              {project.category}
            </Badge>
            {project.date && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(project.date).getFullYear()}
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground mb-4 leading-relaxed flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {(project.technologies || []).slice(0, 3).map((tech: string) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies && project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex gap-3 mt-auto">
            <a href={project.sourceUrl} target="_blank">
              <Button variant="outline" size="sm" className="flex-1 group/btn">
                <Github className="w-4 h-4 mr-2" />
                Code
              </Button>
            </a>
            <a href={project.liveUrl} target="_blank">
              <Button size="sm" className="flex-1 group/btn">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProjectListItem({ project }: { project: any }) {
  return (
    <motion.div
      whileHover={{ x: 8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden relative">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <CardContent className="p-6 md:w-2/3 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{project.category}</Badge>
                {project.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>
              {project.date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(project.date).getFullYear()}
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {(project.technologies || []).map((tech: string) => (
                <Badge key={tech} variant="outline" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3 mt-auto">
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                View Code
              </Button>
              <Button className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
