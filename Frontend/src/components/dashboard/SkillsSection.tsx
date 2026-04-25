import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit3, Check, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";

interface Skills {
  technical: string[];
  languages: string[];
  frameworks: string[];
  _id?: string;
}

const skillCategories = [
  {
    key: "technical" as keyof Skills,
    label: "Technical Skills",
    description: "Programming languages and technical concepts",
  },
  {
    key: "frameworks" as keyof Skills,
    label: "Frameworks & Libraries",
    description: "Development frameworks and libraries",
  },
  {
    key: "languages" as keyof Skills,
    label: "Languages",
    description: "Spoken languages",
  },
];

export function SkillsSection() {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [data, setData] = useState<Skills | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Skills>({
    technical: [],
    languages: [],
    frameworks: [],
  });
  const [newSkills, setNewSkills] = useState<Record<keyof Skills, string>>({
    technical: "",
    languages: "",
    frameworks: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/api/getskill");
      const skillData = res.data.skills?.[0];

      if (skillData) {
        setData(skillData);
        setEditData(skillData);
      } else {
        setData(null);
        setEditData({ technical: [], languages: [], frameworks: [] });
        setIsEditing(true);
      }
    } catch (error: any) {
      console.error("Error fetching skills:", error);
      toast.error(error.response?.data?.message || "Error fetching skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      let res;
      if (data?._id) {
        // Update existing skills
        res = await api.put(`/api/updateskill/${data._id}`, editData);
      } else {
        // Create new skills
        res = await api.post("/api/createskill", editData);
      }

      setData(res.data.skill);
      setEditData(res.data.skill);
      setIsEditing(false);
      toast.success(res.data.message || "Skills saved successfully!");
    } catch (error: any) {
      console.error("Error saving skills:", error);
      toast.error(error.response?.data?.message || "Error saving skills");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (data) {
      setEditData(data);
      setIsEditing(false);
    }
  };

  const addSkill = (category: keyof Skills) => {
    const skill = newSkills[category].trim();
    if (skill && !editData[category].includes(skill)) {
      setEditData({
        ...editData,
        [category]: [...editData[category], skill],
      });
      setNewSkills({ ...newSkills, [category]: "" });
    }
  };

  const removeSkill = (category: keyof Skills, skill: string) => {
    setEditData({
      ...editData,
      [category]: editData[category].filter((s) => s !== skill),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: keyof Skills) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(category);
    }
  };

  const safeData: Skills = data || {
    technical: [],
    languages: [],
    frameworks: [],
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Skills</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              {data && (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Skill Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category.label}
                <Badge variant="outline">
                  {(isEditing ? editData : safeData)[category.key].length}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSkills[category.key]}
                    onChange={(e) =>
                      setNewSkills({
                        ...newSkills,
                        [category.key]: e.target.value,
                      })
                    }
                    placeholder={`Add ${category.label.toLowerCase()}`}
                    onKeyDown={(e) => handleKeyDown(e, category.key)}
                  />
                  <Button
                    onClick={() => addSkill(category.key)}
                    size="sm"
                    disabled={!newSkills[category.key].trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {(isEditing ? editData : safeData)[category.key].map(
                  (skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className={`flex items-center gap-1 ${
                        isEditing ? "pr-1" : ""
                      }`}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(category.key, skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  )
                )}

                {(isEditing ? editData : safeData)[category.key].length ===
                  0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No {category.label.toLowerCase()} added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((category) => (
              <div key={category.key} className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {safeData[category.key].length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {category.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-center">My Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillCategories.map((category) => (
                  <div key={category.key}>
                    <h4 className="font-medium mb-3">{category.label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {safeData[category.key].length > 0 ? (
                        safeData[category.key].map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          No skills added
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
