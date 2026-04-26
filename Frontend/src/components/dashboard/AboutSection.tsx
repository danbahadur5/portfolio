import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload, Edit3, Check, X, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

interface AboutData {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  profile_pic: string;
  location: string;
  email: string;
}

export function AboutSection() {
  const { hasPermission } = useAuth();
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [data, setData] = useState<AboutData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const canEdit = hasPermission("about", "edit");
  const canCreate = hasPermission("about", "create");

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await api.get("/api/getabout");
      console.log("About data from backend:", res.data);
      // Handle both object and array response
      const aboutData = Array.isArray(res.data.about) 
        ? res.data.about[0] 
        : res.data.about;

      if (aboutData) {
        console.log("Setting about data:", aboutData);
        setData(aboutData);
        setEditData(aboutData);
      } else {
        console.log("No about data found, creating new entry");
        // No data exists, prepare for creation
        setData(null);
        setEditData({
          name: "",
          title: "",
          bio: "",
          profile_pic: "",
          location: "",
          email: "",
        });
        setIsEditing(true);
      }
    } catch (err: any) {
      console.error("Error fetching about data:", err);
      toast.error(err.response?.data?.message || "Error fetching about data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("title", editData.title);
      formData.append("bio", editData.bio);
      formData.append("email", editData.email);
      formData.append("location", editData.location || "");

      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      } else if (editData.profile_pic) {
        formData.append("profile_pic", editData.profile_pic);
      }

      let res;
      if (data?._id) {
        // Update existing
        console.log("Updating about with ID:", data._id);
        res = await api.put(`/api/about/${data._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Update response:", res.data);
      } else {
        // Create new
        if (!selectedFile) {
          toast.error("Profile image is required");
          setIsSaving(false);
          return;
        }
        console.log("Creating new about entry");
        res = await api.post("/api/about", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Create response:", res.data);
      }

      console.log("Saved about data:", res.data.about);
      setData(res.data.about);
      setEditData(res.data.about);
      setIsEditing(false);
      setSelectedFile(null);
      toast.success(res.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error saving about data");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (data) {
      setEditData(data);
      setIsEditing(false);
      setSelectedFile(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setEditData({ ...editData!, profile_pic: imageUrl });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!editData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">About Section</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              {(data?._id ? canEdit : canCreate) && (
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
              )}
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
            (canEdit || (!data && canCreate)) && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-64 w-64">
                <AvatarImage src={editData.profile_pic} />
                <AvatarFallback>
                  {editData.name
                    ? editData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "?"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="flex flex-col w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-pic-url" className="text-xs">Profile Picture URL</Label>
                    <Input
                      id="profile-pic-url"
                      value={editData.profile_pic}
                      onChange={(e) =>
                        setEditData({ ...editData, profile_pic: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                      size={1} // Just to make it distinct from standard inputs if needed, but Input usually handles it
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

                  <div className="flex flex-col items-center space-y-2">
                    <Label htmlFor="profile-image" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {selectedFile ? "Change File" : "Upload File"}
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {selectedFile && (
                      <p className="text-sm text-green-600">
                        {selectedFile.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Recommended: 400x400px, max 2MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {data?.name || "Not set"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title *</Label>
              {isEditing ? (
                <Input
                  id="title"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  placeholder="e.g., Full Stack Developer"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {data?.title || "Not set"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  placeholder="e.g., San Francisco, CA"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {data?.location || "Not set"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {data?.email || "Not set"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="bio">About You *</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) =>
                  setEditData({ ...editData, bio: e.target.value })
                }
                placeholder="Tell people about yourself, your experience, and what you're passionate about..."
                rows={6}
              />
            ) : (
              <div className="py-4 px-3 bg-muted rounded-md">
                <p className="whitespace-pre-wrap">{data?.bio || "Not set"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
