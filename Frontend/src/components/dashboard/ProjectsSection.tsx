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
import { Plus, Edit3, Trash2, ExternalLink, Github, X } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from "../../utils/api";

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
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/api/getallproject");

        const projectsData = res.data.projects.map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies)
            ? project.technologies
            : typeof project.technologies === "string"
            ? JSON.parse(project.technologies)
            : [],
          category: project.category || "Other",
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
      category: "Other",
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
      const res = await api.delete(`/api/deleteproject/${id}`);
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
    const token = localStorage.getItem("token");

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
      };

      if (selectedFile) {
        // Use FormData for image upload
        const formData = new FormData();
        Object.keys(payload).forEach((key) => {
          if (key === "technologies") {
            payload.technologies.forEach((tech: string) =>
              formData.append("technologies", tech)
            );
          } else {
            formData.append(key, payload[key]);
          }
        });
        formData.append("image", selectedFile);

        if (newProject._id) {
          res = await api.put(
            `/api/updateproject/${newProject._id}`,
            formData
          );
        } else {
          res = await api.post("/api/createproject", formData);
        }
      } else {
        // Send JSON if no image file
        if (newProject._id) {
          res = await api.put(
            `/api/updateproject/${newProject._id}`,
            payload
          );
        } else {
          res = await api.post("/api/createproject", payload);
        }
      }

      if (newProject._id) {
        setProjects(
          projects.map((p) => (p._id === newProject._id ? res.data.project : p))
        );
      } else {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Projects</h2>
        <Button onClick={handleAddProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="overflow-hidden">
            <div className="relative h-48 bg-muted">
              {project.image ? (
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              {project.featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500 text-white">
                    ⭐ Featured
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{project.title}</h3>
                {project.category && (
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                {Array.isArray(project.technologies) &&
                project.technologies.length > 0 ? (
                  <>
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <Badge
                        key={`${tech}-${idx}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No technologies listed
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {project.sourceUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditProject(project)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No projects added yet</p>
            <Button onClick={handleAddProject}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

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
              <div className="space-y-2">
                <Label>Project Image *</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>Upload Image</span>
                    </Button>
                  </Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {selectedFile && <span>{selectedFile.name}</span>}
                </div>
                <Input
                  value={newProject.image}
                  onChange={(e) =>
                    setNewProject({ ...newProject, image: e.target.value })
                  }
                  placeholder="Or provide image URL"
                />
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
