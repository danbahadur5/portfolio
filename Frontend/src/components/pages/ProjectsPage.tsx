import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Filter,
  Grid,
  List,
  Link,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SearchFilter } from "../SearchFilter";
import { LoadingSpinner } from "../LoadingSpinner";
import { useProjects } from "@/hooks/useProjects";

export function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
        new Set(projects?.flatMap((p) => p.technologies) || []),
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
        selectedTech.every((tech) => project.technologies.includes(tech));

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
              Selected <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              A curated showcase of engineering excellence, combining
              performance with intuitive design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-20 z-30 py-4 lg:py-6 px-4 lg:px-6 glass border-y border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 lg:px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto">
            <div className="relative flex-grow lg:flex-grow-0 min-w-0">
              <SearchFilter
                onSearch={handleSearch}
                className="w-full lg:w-64"
              />
            </div>
            <div className="flex p-1 bg-muted rounded-xl flex-shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
              >
                <Grid className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
              >
                <List className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 lg:py-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                  : "space-y-6 lg:space-y-8"
              }
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
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold font-heading mb-3 lg:mb-4 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm lg:text-base text-muted-foreground text-sm font-light leading-relaxed mb-6 lg:mb-8 line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 mt-auto">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-lg bg-accent/50 text-[10px] lg:text-[11px] font-bold text-accent-foreground/60 uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-border/30">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
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
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
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
    </div>
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
            {project.technologies.slice(0, 3).map((tech: string) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
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
              {project.technologies.map((tech: string) => (
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
