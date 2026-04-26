import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Building2,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

interface Experience {
  _id?: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date?: string;
  description: string;
  achievements: string[];
}

export function ExperienceSection() {
  const { hasPermission } = useAuth();
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canCreate = hasPermission("experience", "create");
  const canEdit = hasPermission("experience", "edit");
  const canDelete = hasPermission("experience", "delete");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await api.get("/api/getexperience");
      console.log("Fetched experiences:", res.data);
      setExperiences(res.data.experiences || []);
    } catch (err: any) {
      console.error("Error fetching experiences:", err);
      toast.error(err.response?.data?.message || "Error fetching experiences");
    } finally {
      setIsLoading(false);
    }
  };

  function handleAddExperience() {
    setNewExperience({
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      description: "",
      achievements: [],
    });
    setIsDialogOpen(true);
  }

  function handleEditExperience(experience: Experience) {
    setNewExperience({
      ...experience,
      start_date: experience.start_date
        ? new Date(experience.start_date).toISOString().split("T")[0]
        : "",
      end_date: experience.end_date
        ? new Date(experience.end_date).toISOString().split("T")[0]
        : "",
    });
    setIsDialogOpen(true);
  }

  async function handleDeleteExperience(id?: string) {
    if (!id) return;

    try {
      const res = await api.delete(`/api/experience/${id}`);

      toast.success(res.data.message);
      setExperiences(experiences.filter((e) => e._id !== id));
    } catch (err: any) {
      console.error("Error deleting experience:", err);
      toast.error(err.response?.data?.message || "Error deleting experience");
    }
  }

  async function handleSaveExperience() {
    if (!newExperience) return;

    setIsSaving(true);

    try {
      let res;
      if (newExperience._id) {
        // Update experience
        console.log("Updating experience with ID:", newExperience._id);
        res = await api.put(
          `/api/experience/${newExperience._id}`,
          newExperience
        );
        console.log("Update response:", res.data);

        setExperiences(
          experiences.map((e) =>
            e._id === newExperience._id ? res.data.experience : e
          )
        );
      } else {
        // Create experience
        console.log("Creating new experience");
        res = await api.post("/api/experience", newExperience);
        console.log("Create response:", res.data);

        setExperiences([...experiences, res.data.experience]);
      }

      toast.success(res.data.message);
      setIsDialogOpen(false);
      setNewExperience(null);
    } catch (err: any) {
      console.error("Error saving experience:", err);
      toast.error(err.response?.data?.message || "Error saving experience");
    } finally {
      setIsSaving(false);
    }
  }

  const addAchievement = () => {
    if (newAchievement && newExperience) {
      setNewExperience({
        ...newExperience,
        achievements: [...newExperience.achievements, newAchievement],
      });
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    if (newExperience) {
      setNewExperience({
        ...newExperience,
        achievements: newExperience.achievements.filter((_, i) => i !== index),
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Work Experience</h2>
        {canCreate && (
          <Button onClick={handleAddExperience}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experiences.map((experience) => (
          <Card key={experience._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{experience.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {experience.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(experience.start_date)} -{" "}
                      {formatDate(experience.end_date)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditExperience(experience)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteExperience(experience._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {experience.description}
              </p>

              {experience.achievements &&
                experience.achievements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Key Achievements:</h4>
                    <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No experience added yet
            </p>
            <Button onClick={handleAddExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Experience
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Experience Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {newExperience?._id ? "Edit Experience" : "Add New Experience"}
            </DialogTitle>
          </DialogHeader>

          {newExperience && (
            <div className="space-y-4">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      company: e.target.value,
                    })
                  }
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={newExperience.location}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    type="date"
                    id="start_date"
                    value={newExperience.start_date}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        start_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    type="date"
                    id="end_date"
                    value={newExperience.end_date || ""}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        end_date: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if currently working here
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your role and responsibilities..."
                  rows={4}
                />
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <Label>Key Achievements</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addAchievement())
                    }
                  />
                  <Button
                    onClick={addAchievement}
                    size="sm"
                    type="button"
                    disabled={!newAchievement.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 min-h-[40px] p-2 border rounded-md">
                  {newExperience.achievements &&
                  newExperience.achievements.length > 0 ? (
                    newExperience.achievements.map((achievement, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-muted rounded-md"
                      >
                        <span className="flex-1 text-sm">{achievement}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No achievements added yet. Add key accomplishments from
                      this role.
                    </p>
                  )}
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveExperience} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {newExperience._id ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{newExperience._id ? "Update" : "Add Experience"}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
