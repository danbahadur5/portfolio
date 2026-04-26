import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Plus, Edit3, Trash2, Calendar, Tag, X, Loader2, FileText, Upload } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Switch } from "../ui/switch";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

interface Blog {
  _id?: string;
  title: string;
  featured: boolean;
  content: string;
  featuredImage: string;
  tags: string[];
  createdAt?: string;
}

export function BlogsSection() {
  const { hasPermission } = useAuth();
  const backend = import.meta.env.VITE_BACKEND_URL!;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const canCreate = hasPermission("blog", "create");
  const canEdit = hasPermission("blog", "edit");
  const canDelete = hasPermission("blog", "delete");

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
      featuredImage: "",
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
      const res = await api.delete(`/api/blogs/${id}`);

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

    try {
      const formData = new FormData();
      formData.append("title", newBlog.title);
      formData.append("featured", String(newBlog.featured));
      formData.append("content", newBlog.content);
      formData.append("tags", JSON.stringify(newBlog.tags));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (newBlog.featuredImage) {
        formData.append("featuredImage", newBlog.featuredImage);
      }

      let res;
      if (newBlog._id) {
        // Update blog
        console.log("Updating blog with ID:", newBlog._id);
        res = await api.put(`/api/blogs/${newBlog._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Update response:", res.data);

        setBlogs(blogs.map((b) => (b._id === newBlog._id ? res.data.blog : b)));
      } else {
        // Create blog
        if (!selectedFile && !newBlog.featuredImage) {
          toast.error("Blog image is required");
          setIsSaving(false);
          return;
        }

        console.log("Creating new blog");
        res = await api.post("/api/blogs", formData, {
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
        setNewBlog({ ...newBlog, featuredImage: e.target.files[0].name });
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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Articles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Write and publish blog posts to your site.
          </p>
        </div>
        {canCreate && (
          <Button 
            onClick={handleAddBlog}
            className="h-10 rounded-xl shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-slate-200/50 dark:ring-slate-800/50">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold">No articles yet</h3>
            <p className="text-sm text-slate-500 mt-1">Share your thoughts with the world.</p>
          </div>
        ) : (
          blogs.map((blog) => (
            <Card key={blog._id} className="group border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 rounded-2xl">
              <div className="relative h-48 overflow-hidden">
                {blog.featuredImage ? (
                  <ImageWithFallback
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <FileText className="h-10 w-10 mb-2 opacity-20" />
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">No Image</span>
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  {blog.featured && (
                    <Badge className="bg-primary hover:bg-primary text-primary-foreground font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-lg border-none">
                      FEATURED
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "Recently"}
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">
                  {blog.title}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                  {blog.content}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6 min-h-[1.5rem]">
                  {blog.tags?.slice(0, 3).map((tag: string, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-end gap-2">
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                      onClick={() => handleEditBlog(blog)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:text-red-600 font-bold text-xs"
                      onClick={() => handleDeleteBlog(blog._id!)}
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
              <div className="space-y-4">
                <Label>Blog Image *</Label>
                
                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <Label htmlFor="image-url" className="text-xs">Image URL</Label>
                    <Input
                      id="image-url"
                      value={newBlog.featuredImage}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, featuredImage: e.target.value })
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
