import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Calendar, Clock, Filter, Grid, List, Link } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { SearchFilter } from '../SearchFilter';
import { LoadingSpinner } from '../LoadingSpinner';
import { projectsData } from '../../data/projects';
import axios from 'axios';
import { toast } from 'react-toastify';

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  // const { projects } = projectsData;
const  fetchProjects = async()=>{
  const backend = import.meta.env.VITE_BACKEND_URL
    setIsLoading(true);
    await axios.get(`${backend}/api/getallproject`). then((res)=>{
          setProjects(res.data.projects);
        }).catch((err)=>{
          toast.error(err.response?.data?.message || "Error fetching projects");
        }).finally(() => {
          setIsLoading(false);
        });
      }
  useEffect(() => { 
  fetchProjects();
  }, []);
  
  // Get unique categories and technologies
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const technologies = Array.from(new Set(projects.flatMap(p => p.technologies))).sort();

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const matchesTech = selectedTech.length === 0 || 
                         selectedTech.every(tech => project.technologies.includes(tech));
      
      return matchesSearch && matchesCategory && matchesTech;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'oldest':
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, selectedCategory, selectedTech, sortBy]);

  const handleSearch = (term: string) => {
    // setIsLoading(true); // Don't trigger full page loader for search
    setSearchTerm(term);
    // Simulate loading delay for better UX
    // setTimeout(() => setIsLoading(false), 300);
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              My <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A collection of projects I've built over the years, showcasing my skills in 
              web development, design, and problem-solving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              selectedTech={selectedTech}
              onTechChange={setSelectedTech}
              technologies={technologies}
            />
          </motion.div>

          {/* View Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </span>
              {isLoading && <LoadingSpinner size="sm" />}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>

              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-12"
              >
                <LoadingSpinner size="lg" />
              </motion.div>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedTech([]);
                  }}
                >
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
                    : 'space-y-6'
                }
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    {viewMode === 'grid' ? (
                      <ProjectCard project={project} />
                    ) : (
                      <ProjectListItem project={project} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
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
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
            <a href={project.sourceUrl} target='_blank'> 
            <Button variant="outline" size="sm" className="flex-1 group/btn">
              <Github className="w-4 h-4 mr-2" />
              Code
            </Button>
            </a>
            <a href={project.liveUrl} target='_blank'>
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
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                <Badge variant="secondary">
                  {project.category}
                </Badge>
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