import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Star,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Quote,
  Loader2,
  Upload,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  featured: boolean;
  approved: boolean;
  linkedinUrl: string;
  order: number;
  createdAt: string;
}

export function TestimonialsSection() {
  const { hasPermission } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
    linkedinUrl: "",
    featured: false,
  });
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const canCreate = hasPermission("testimonials", "create");
  const canEdit = hasPermission("testimonials", "edit");
  const canDelete = hasPermission("testimonials", "delete");
  const canApprove = hasPermission("testimonials", "approve");

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const endpoint = filter === "all" ? "/api/testimonials/all" : `/api/testimonials/all?approved=${filter === "approved"}`;
      const response = await api.get(endpoint);
      setTestimonials(response.data.testimonials || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("role", formData.role || "");
      data.append("company", formData.company || "");
      data.append("content", formData.content);
      data.append("rating", formData.rating.toString());
      data.append("linkedinUrl", formData.linkedinUrl || "");
      data.append("featured", formData.featured.toString());

      if (selectedFile) {
        data.append("avatar", selectedFile);
      } else if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      if (editingTestimonial) {
        await api.put(`/api/testimonials/${editingTestimonial._id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Testimonial updated successfully");
      } else {
        await api.post("/api/testimonials", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Testimonial created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save testimonial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/api/testimonials/${id}`);
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete testimonial");
    }
  };

  const handleApprove = async (testimonial: Testimonial) => {
    try {
      await api.put(`/api/testimonials/${testimonial._id}/approve`, { approved: !testimonial.approved });
      toast.success(testimonial.approved ? "Testimonial unapproved" : "Testimonial approved");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update testimonial");
    }
  };

  const handleToggleFeatured = async (testimonial: Testimonial) => {
    try {
      await api.put(`/api/testimonials/${testimonial._id}/featured`);
      toast.success(testimonial.featured ? "Removed from featured" : "Added to featured");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update testimonial");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatar: "",
      linkedinUrl: "",
      featured: false,
    });
    setEditingTestimonial(null);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
      linkedinUrl: testimonial.linkedinUrl,
      featured: testimonial.featured,
    });
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-muted-foreground">Manage client testimonials and reviews</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2 border rounded-md p-1">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "approved" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filter === "pending" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
          </div>
          {canCreate && (
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Testimonial</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No testimonials found
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Quote className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role && `${testimonial.role}`}
                            {testimonial.role && testimonial.company && " at "}
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex">{renderStars(testimonial.rating)}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={testimonial.approved ? "default" : "secondary"}>
                        {testimonial.approved ? "Approved" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={testimonial.featured}
                        onCheckedChange={() => handleToggleFeatured(testimonial)}
                        disabled={!canEdit}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {canApprove && (
                            <DropdownMenuItem onClick={() => handleApprove(testimonial)}>
                              {testimonial.approved ? (
                                <>
                                  <X className="mr-2 h-4 w-4" /> Unapprove
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Approve
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          {canEdit && (
                            <DropdownMenuItem onClick={() => openEditDialog(testimonial)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {testimonial.linkedinUrl && (
                            <DropdownMenuItem asChild>
                              <a href={testimonial.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> View LinkedIn
                              </a>
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(testimonial._id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial
                  ? "Update the testimonial details below"
                  : "Add a new client testimonial to your portfolio"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="CEO, Developer, Designer..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Testimonial *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                  placeholder="What did the client say about your work?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar Image</Label>
                  <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              {selectedFile ? "Change File" : "Upload File"}
                            </span>
                          </Button>
                        </Label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {selectedFile && (
                          <p className="text-xs text-green-600 truncate max-w-[150px]">
                            {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or URL</span>
                      </div>
                    </div>

                    <Input
                      id="avatar"
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured testimonial</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTestimonial ? "Update" : "Create"} Testimonial
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
