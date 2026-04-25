import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus, Edit3, Trash2, Calendar, Tag, X, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Switch } from "../ui/switch";
import api from "../../utils/api";

interface Blog {
  _id?: string;
  title: string;
  featured: boolean;
  content: string;
  image: string;
  tags: string[];
  createdAt?: string;
}

export function BlogsSection() {
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/getblogs");
      setBlogs(res.data.blogs || []);
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      toast.error(err.response?.data?.message || "Error fetching blogs");
    } finally {
      setIsLoading(false);
    }
  };

  function handleAddBlog() {
    setNewBlog({
      title: "",
      featured: false,
      content: "",
      image: "",
      tags: [],
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  }

  function handleEditBlog(blog: Blog) {
    setNewBlog(blog);
    setSelectedFile(null);
    setIsDialogOpen(true);
  }

  async function handleDeleteBlog(id?: string) {
    if (!id) return;

    try {
      const res = await api.delete(`/api/deleteblog/${id}`);

      toast.success(res.data.message);
      setBlogs(blogs.filter((b) => b._id !== id));
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      toast.error(err.response?.data?.message || "Error deleting blog");
    }
  }

  async function handleSaveBlog() {
    if (!newBlog) return;

    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("featured", String(newBlog.featured));
      formData.append("content", newBlog.content);
      formData.append("tags", JSON.stringify(newBlog.tags));

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let res;
      if (newBlog._id) {
        // Update blog
        console.log("Updating blog with ID:", newBlog._id);
        res = await api.put(`/api/updateblog/${newBlog._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Update response:", res.data);

        setBlogs(blogs.map((b) => (b._id === newBlog._id ? res.data.blog : b)));
      } else {
        // Create blog
        if (!selectedFile) {
          toast.error("Blog image is required");
          setIsSaving(false);
          return;
        }

        console.log("Creating new blog");
        res = await api.post("/api/createblog", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Create response:", res.data);

        setBlogs([res.data.blog, ...blogs]);
      }

      toast.success(res.data.message);
      setIsDialogOpen(false);
      setNewBlog(null);
      setSelectedFile(null);
    } catch (err: any) {
      console.error("Error saving blog:", err);
      toast.error(err.response?.data?.message || "Error saving blog");
    } finally {
      setIsSaving(false);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (newBlog) {
        setNewBlog({ ...newBlog, image: e.target.files[0].name });
      }
    }
  }

  const addTag = () => {
    if (newTag && newBlog && !newBlog.tags.includes(newTag)) {
      setNewBlog({
        ...newBlog,
        tags: [...newBlog.tags, newTag],
      });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    if (newBlog) {
      setNewBlog({
        ...newBlog,
        tags: newBlog.tags.filter((t) => t !== tag),
      });
    }
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
        <h2 className="text-3xl font-semibold">Blogs</h2>
        <Button onClick={handleAddBlog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Blog
        </Button>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog._id} className="overflow-hidden">
            <div className="relative h-48 bg-muted">
              {blog.image ? (
                <ImageWithFallback
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              {blog.featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500 text-white">
                    ⭐ Featured
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{blog.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {blog.content}
              </p>

              <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                {blog.tags && blog.tags.length > 0 ? (
                  <>
                    {blog.tags.slice(0, 3).map((tag: string, idx) => (
                      <Badge
                        key={`${tag}-${idx}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No tags
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditBlog(blog)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBlog(blog._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {blogs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No blogs added yet</p>
            <Button onClick={handleAddBlog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Blog
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {newBlog?._id ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>

          {newBlog && (
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="blog-title">Title *</Label>
                <Input
                  id="blog-title"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                  placeholder="My Awesome Blog Post"
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">
                    ⭐ Featured Blog
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display this blog prominently
                  </p>
                </div>
                <Switch
                  checked={newBlog.featured}
                  onCheckedChange={(checked: any) =>
                    setNewBlog({ ...newBlog, featured: checked })
                  }
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="blog-content">Content *</Label>
                <Textarea
                  id="blog-content"
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.target.value })
                  }
                  placeholder="Write your blog content here..."
                  rows={8}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Blog Image *</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        {selectedFile ? "Change Image" : "Upload Image"}
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
                  {!selectedFile && newBlog.image && (
                    <span className="text-sm text-muted-foreground">
                      Current: {newBlog.image}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g., React, JavaScript)"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button
                    onClick={addTag}
                    size="sm"
                    type="button"
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                  {newBlog.tags && newBlog.tags.length > 0 ? (
                    newBlog.tags.map((tag: string, idx) => (
                      <Badge
                        key={`${tag}-${idx}`}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No tags added yet. Type and press Enter or click Add.
                    </span>
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
                <Button onClick={handleSaveBlog} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {newBlog._id ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{newBlog._id ? "Update Blog" : "Create Blog"}</>
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
