import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Edit3,
  Check,
  X,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { Label } from "../ui/label";
import { useAuth } from "../../contexts/AuthContext";

interface ContactData {
  email: string;
  phone: string;
  linkedin_profile: string;
  github_profile: string;
  twitter_profile: string;
  personal_website: string;
  _id?: string;
}

const contactFields = [
  {
    key: "email" as keyof ContactData,
    label: "Email Address",
    icon: Mail,
    placeholder: "your.email@example.com",
    type: "email",
  },
  {
    key: "phone" as keyof ContactData,
    label: "Phone Number",
    icon: Phone,
    placeholder: "+1 (555) 123-4567",
    type: "tel",
  },
  {
    key: "linkedin_profile" as keyof ContactData,
    label: "LinkedIn Profile",
    icon: Linkedin,
    placeholder: "linkedin.com/in/yourprofile",
    type: "url",
  },
  {
    key: "github_profile" as keyof ContactData,
    label: "GitHub Profile",
    icon: Github,
    placeholder: "github.com/yourusername",
    type: "url",
  },
  {
    key: "twitter_profile" as keyof ContactData,
    label: "Twitter Profile",
    icon: Twitter,
    placeholder: "@yourusername or twitter.com/yourusername",
    type: "text",
  },
  {
    key: "personal_website" as keyof ContactData,
    label: "Personal Website",
    icon: Globe,
    placeholder: "https://yourwebsite.com",
    type: "url",
  },
];

export function ContactSection() {
  const { hasPermission } = useAuth();
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [data, setData] = useState<ContactData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ContactData>({
    email: "",
    phone: "",
    linkedin_profile: "",
    github_profile: "",
    twitter_profile: "",
    personal_website: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canEdit = hasPermission("contact", "edit");
  const canCreate = hasPermission("contact", "create");

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await api.get("/api/getcontact");
      console.log("Fetched contact data:", response.data);
      const contactData = response.data.contacts[0];

      if (contactData) {
        setData(contactData);
        setEditData(contactData);
      } else {
        // No data exists, prepare for creation
        setData(null);
        setEditData({
          email: "",
          phone: "",
          linkedin_profile: "",
          github_profile: "",
          twitter_profile: "",
          personal_website: "",
        });
        setIsEditing(true);
      }
    } catch (error: any) {
      console.error("Error fetching contact data:", error);
      toast.error(
        error.response?.data?.message || "Error fetching contact data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  async function handleSave() {
    if (!editData.email) {
      toast.error("Email is required");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      let res;
      if (data?._id) {
        // Update existing contact
        console.log("Updating contact with ID:", data._id);
        res = await api.put(`/api/contact/${data._id}`, editData);
        console.log("Update response:", res.data);
      } else {
        // Create new contact
        console.log("Creating new contact");
        res = await api.post("/api/contact", editData);
        console.log("Create response:", res.data);
      }

      setData(res.data.contact);
      setEditData(res.data.contact);
      setIsEditing(false);
      toast.success(res.data.message);
    } catch (error: any) {
      console.error("Error saving contact data:", error);
      toast.error(error.response?.data?.message || "Error saving contact data");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (data) {
      setEditData(data);
      setIsEditing(false);
    }
  }

  const getValidUrl = (url: string, type: string) => {
    if (!url) return "";
    if (type === "email") return `mailto:${url}`;
    if (type === "tel") return `tel:${url}`;
    if (type === "text" && url.startsWith("@"))
      return `https://twitter.com/${url.substring(1)}`;
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      return `https://${url}`;
    return url;
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
        <h2 className="text-3xl font-semibold">Contact Information</h2>
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
            (data?._id ? canEdit : canCreate) && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                {data?._id ? "Edit" : "Create"}
              </Button>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contactFields.map((field) => (
          <Card key={field.key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <field.icon className="h-5 w-5" />
                {field.label}
                {field.key === "email" && (
                  <span className="text-destructive">*</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      type={field.type}
                      value={editData?.[field.key] || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-md min-h-[44px] flex items-center">
                    {editData?.[field.key] ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="break-all">{editData[field.key]}</span>
                        {field.type !== "tel" && (
                          <Button size="sm" variant="ghost" asChild>
                            <a
                              href={getValidUrl(
                                editData[field.key],
                                field.type
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not provided
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!data && !isEditing && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No contact information added yet
            </p>
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Add Contact Information
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
