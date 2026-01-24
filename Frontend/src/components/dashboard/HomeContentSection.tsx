import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Upload, Edit3, Check, X, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

interface HomeContentData {
  _id?: string;
  name: string;
  position: string;
  summary: string;
  description: string;
  profile_pic: string;
  location: string;
}

export function HomeContentSection() {
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [data, setData] = useState<HomeContentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<HomeContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const res = await axios.get(`${backend}/api/gethomecontent`);
      console.log("Home content from backend:", res.data);
      const homeData = res.data.homeContent?.[0];
      if (homeData) {
        setData(homeData);
        setEditData(homeData);
      } else {
        // No data exists, prepare for creation
        setData(null);
        setEditData({
          name: "",
          position: "",
          summary: "",
          description: "",
          profile_pic: "",
          location: "",
        });
        setIsEditing(true);
      }
    } catch (err: any) {
      console.error("Error fetching home content:", err);
      toast.error(err.response?.data?.message || "Error fetching home content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData) return;

    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("position", editData.position);
      formData.append("summary", editData.summary);
      formData.append("description", editData.description || "");
      formData.append("location", editData.location || "");

      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      } else if (editData.profile_pic) {
         formData.append("profile_pic", editData.profile_pic);
      }

      let res;
      if (data?._id) {
        // Update existing
        res = await axios.put(
          `${backend}/api/updatehomecontent/${data._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new
        res = await axios.post(
          `${backend}/api/createhomecontent`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Home content saved successfully");
      setIsEditing(false);
      fetchHomeContent();
    } catch (err: any) {
      console.error("Error saving home content:", err);
      toast.error(err.response?.data?.message || "Error saving home content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(data);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => prev ? { ...prev, profile_pic: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Home Page Content</CardTitle>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Label className="mb-2 block">Profile Picture</Label>
              <div className="relative group">
                <Avatar className="w-32 h-32 border-2 border-border">
                  <AvatarImage src={editData?.profile_pic} />
                  <AvatarFallback>
                    {editData?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editData?.name || ""}
                    onChange={(e) =>
                      setEditData((prev) => prev ? { ...prev, name: e.target.value } : null)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position/Role</Label>
                  <Input
                    id="position"
                    value={editData?.position || ""}
                    onChange={(e) =>
                      setEditData((prev) => prev ? { ...prev, position: e.target.value } : null)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editData?.location || ""}
                  onChange={(e) =>
                    setEditData((prev) => prev ? { ...prev, location: e.target.value } : null)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary (Short Bio)</Label>
                <Textarea
                  id="summary"
                  value={editData?.summary || ""}
                  onChange={(e) =>
                    setEditData((prev) => prev ? { ...prev, summary: e.target.value } : null)
                  }
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={editData?.description || ""}
                  onChange={(e) =>
                    setEditData((prev) => prev ? { ...prev, description: e.target.value } : null)
                  }
                  disabled={!isEditing}
                  rows={5}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
