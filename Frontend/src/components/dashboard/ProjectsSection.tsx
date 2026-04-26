"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus, Edit3, Trash2, ExternalLink, Github, X, Briefcase, Upload } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

// ✅ TypeScript interface
interface Project {
  _id?: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  sourceUrl: string;
  category?: string;
  featured?: boolean;
}

// ✅ Project categories
const PROJECT_CATEGORIES = [
  "all",
  "Full-Stack",
  "Frontend",
  "Backend",
  "Mobile App",
  "AI/ML",
  "Data Science",
  "E-Commerce",
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "DevOps",
  "Blockchain",
  "Game Development",
  "Other",
];

export function ProjectsSection() {
  const { hasPermission } = useAuth();
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canCreate = hasPermission("projects", "create");
  const canEdit = hasPermission("projects", "edit");
  const canDelete = hasPermission("projects", "delete");

  // ✅ Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/getallproject");

        const projectsData = (res.data?.projects || []).map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies)
            ? project.technologies
            : typeof project.technologies === "string"
            ? JSON.parse(project.technologies)
            : [],
          category: project.category || "all",
          featured: project.featured === true || project.featured === "true",
        }));

        setProjects(projectsData);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Error fetching projects");
        console.error(err);
      }
    };
    fetchProjects();
  }, [backend]);

  // ✅ Add Technology
  const addTechnology = () => {
    if (newTech && newProject) {
      const techs = newProject.technologies || [];
      if (!techs.includes(newTech)) {
        setNewProject({ ...newProject, technologies: [...techs, newTech] });
        setNewTech("");
      }
    }
  };

  // ✅ Remove Technology
  const removeTechnology = (tech: string) => {
    if (newProject && newProject.technologies) {
      setNewProject({
        ...newProject,
        technologies: newProject.technologies.filter((t) => t !== tech),
      });
    }
  };

  // ✅ Form validation
  const isFormValid = () => {
    if (!newProject) return false;
    return (
      newProject.title.trim() !== "" &&
      newProject.description.trim() !== "" &&
      (newProject.image.trim() !== "" || selectedFile !== null) &&
      newProject.technologies.length > 0
    );
  };

  // ✅ Open dialog for adding project
  function handleAddProject() {
    setNewProject({
      title: "",
      description: "",
      image: "",
      technologies: [],
      liveUrl: "",
      sourceUrl: "",
      category: "all",
      featured: false,
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  }

  // ✅ Edit project
  function handleEditProject(project: Project) {
    setNewProject(project);
    setIsDialogOpen(true);
  }

  // ✅ Delete project
  async function handleDeleteProject(id?: string) {
    if (!id) return;
    try {
      const res = await api.delete(`/api/projects/${id}`);
      toast.success(res.data.message);
      setProjects(projects.filter((p) => p._id !== id));
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting project");
    }
  }

  // ✅ Save project (create/update)
  async function handleSaveProject() {
    if (!newProject || !isFormValid()) return;
    setIsLoading(true);

    try {
      let res;
      const payload: any = {
        title: newProject.title,
        description: newProject.description,
        liveUrl: newProject.liveUrl,
        sourceUrl: newProject.sourceUrl,
        category: newProject.category || "Other",
        featured: !!newProject.featured,
        technologies: newProject.technologies || [],
        image: newProject.image, // Include image URL in payload
      };

      if (selectedFile) {
        // Use FormData for image upload
        const formData = new FormData();
        Object.keys(payload).forEach((key) => {
          if (key === "technologies") {
            // Send technologies as a JSON string to avoid array format issues with Multer
            formData.append("technologies", JSON.stringify(payload.technologies));
          } else {
            formData.append(key, payload[key]);
          }
        });
        formData.append("image", selectedFile);

        if (newProject._id) {
          res = await api.put(
            `/api/projects/${newProject._id}`,
            formData
          );
        } else {
          res = await api.post("/api/projects", formData);
        }
      } else {
        // Send JSON if no image file
        if (newProject._id) {
          res = await api.put(
            `/api/projects/${newProject._id}`,
            payload
          );
        } else {
          res = await api.post("/api/projects", payload);
        }
      }

      if (newProject._id) {
        setProjects(
          projects.map((p) => (p._id === newProject._id ? res.data?.project || p : p))
        );
      } else if (res.data?.project) {
        setProjects([...projects, res.data.project]);
      }

      toast.success(res.data.message);
      setIsDialogOpen(false);
      setNewProject(null);
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving project");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Handle image upload
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (newProject) {
        setNewProject({ ...newProject, image: e.target.files[0].name });
      }
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Showcase and manage your professional projects.
          </p>
        </div>
        {canCreate && (
          <Button 
            onClick={handleAddProject}
            className="h-10 rounded-xl shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-slate-200/50 dark:ring-slate-800/50">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold">No projects yet</h3>
            <p className="text-sm text-slate-500 mt-1">Click the button above to add your first project.</p>
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project._id} className="group border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 rounded-2xl">
              <div className="relative h-56 overflow-hidden">
                {project.image ? (
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Briefcase className="h-10 w-10 mb-2 opacity-20" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Preview</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 left-3 flex gap-2">
                  {project.featured && (
                    <Badge className="bg-amber-400 hover:bg-amber-400 text-black font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-lg border-none">
                      FEATURED
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm border-none">
                    {project.category}
                  </Badge>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                  {project.liveUrl && (
                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border-none" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.sourceUrl && (
                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border-none" asChild>
                      <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(project.technologies || []).slice(0, 4).map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies && project.technologies.length > 4 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-primary/10 text-primary uppercase tracking-wider">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-end gap-2">
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:text-red-600 font-bold text-xs"
                      onClick={() => handleDeleteProject(project._id!)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {newProject?._id ? "Edit Project" : "Add New Project"}
            </DialogTitle>
          </DialogHeader>

          {newProject && (
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="project-title">Project Title *</Label>
                <Input
                  id="project-title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="project-description">Description *</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="project-category">Category</Label>
                <Select
                  value={newProject.category}
                  onValueChange={(value: string) =>
                    setNewProject({ ...newProject, category: value })
                  }
                >
                  <SelectTrigger id="project-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image */}
              <div className="space-y-4">
                <Label>Project Image *</Label>
                
                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-xs">Image URL</Label>
                    <Input
                      id="image-url"
                      value={newProject.image}
                      onChange={(e) =>
                        setNewProject({ ...newProject, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or upload file</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {selectedFile ? "Change File" : "Upload File"}
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {selectedFile && (
                      <span className="text-sm text-green-600">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label>Technologies Used *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="e.g., React, Node.js"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTechnology())
                    }
                  />
                  <Button
                    onClick={addTechnology}
                    size="sm"
                    disabled={!newTech.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                  {Array.isArray(newProject.technologies) &&
                  newProject.technologies.length > 0 ? (
                    newProject.technologies.map((tech, idx) => (
                      <Badge
                        key={`${tech}-${idx}`}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                        >
                          <X className="h-3 w-3 ml-1 hover:text-destructive transition-colors" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No technologies added yet. Type and press Enter or click
                      Add.
                    </span>
                  )}
                </div>
              </div>

              {/* Live & Source URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="live-url">Live URL</Label>
                  <Input
                    id="live-url"
                    value={newProject.liveUrl}
                    onChange={(e) =>
                      setNewProject({ ...newProject, liveUrl: e.target.value })
                    }
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-url">Source URL</Label>
                  <Input
                    id="source-url"
                    value={newProject.sourceUrl}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        sourceUrl: e.target.value,
                      })
                    }
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">
                    ⭐ Featured Project
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display this project prominently on your homepage
                  </p>
                </div>
                <Button
                  type="button"
                  variant={newProject.featured ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setNewProject({
                      ...newProject,
                      featured: !newProject.featured,
                    })
                  }
                >
                  {newProject.featured ? "Featured" : "Not Featured"}
                </Button>
              </div>

              {/* Dialog actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProject}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      {newProject._id ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{newProject._id ? "Update Project" : "Add Project"}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
}
