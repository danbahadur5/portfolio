import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  Settings,
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  FileText,
  Palette,
  LogOut,
  Home,
  Star,
  Shield,
  Menu,
  ChevronRight,
  Loader2,
  Plus,
  Eye,
  Edit3,
  Save,
  Trash2,
  Moon,
  Sun,
  Users,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { HomeContentSection } from "./dashboard/HomeContentSection";
import { AboutSection } from "./dashboard/AboutSection";
import { ProjectsSection } from "./dashboard/ProjectsSection";
import { SkillsSection } from "./dashboard/SkillsSection";
import { ExperienceSection } from "./dashboard/ExperienceSection";
import { ContactSection } from "./dashboard/ContactSection";
import { BlogsSection } from "./dashboard/BlogsSection";
import { TestimonialsSection } from "./dashboard/TestimonialsSection";
import { SettingsSection } from "./dashboard/SettingsSection";
import api from "../utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ErrorBoundary from "./ErrorBoundary";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "./ui/separator";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  roles?: string[];
  group?: "content" | "system" | "admin";
}

const menuItems: MenuItem[] = [
  { id: "dashboard", title: "Overview", icon: LayoutDashboard, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "home", title: "Home Page", icon: Home, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "about", title: "About Me", icon: User, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "projects", title: "Portfolio", icon: Briefcase, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "skills", title: "Expertise", icon: GraduationCap, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "experience", title: "Journey", icon: Briefcase, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "testimonials", title: "Feedback", icon: Star, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "blogs", title: "Articles", icon: FileText, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "messages", title: "Inquiries", icon: Mail, roles: ["admin", "superadmin", "editor"], group: "content" },
  { id: "users", title: "Team", icon: Users, roles: ["superadmin"], group: "admin" },
  { id: "settings", title: "Configuration", icon: Settings, roles: ["admin", "superadmin"], group: "system" },
];

export function PortfolioDashboard() {
  const { user, logout, hasRole, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const path = location.pathname.replace("/dashboard/", "");
    if (path && path !== "dashboard") {
      setActiveSection(path);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      toast.success("All changes saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return hasRole(...item.roles);
  });

  const onSave = () => setHasUnsavedChanges(true);

  const MessagesSection = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchMessages();
    }, []);

    const fetchMessages = async () => {
      try {
        const response = await api.get("/api/messages");
        setMessages(response.data.messages || []);
      } catch (error) {
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id: string) => {
      if (!confirm("Delete this message?")) return;
      try {
        await api.delete(`/api/messages/${id}`);
        toast.success("Message deleted");
        fetchMessages();
      } catch (error) {
        toast.error("Failed to delete message");
      }
    };

    if (loading) {
      return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-muted-foreground">View and manage contact form submissions</p>
        </div>
        <div className="grid gap-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No messages yet</div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{msg.name}</h3>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={msg.status === "unread" ? "default" : "secondary"}>
                      {msg.status}
                    </Badge>
                    {hasPermission("messages", "delete") && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(msg._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="font-medium">{msg.subject}</p>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const UsersSection = () => {
    const { hasRole } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (hasRole("superadmin")) {
        fetchUsers();
      } else {
        setLoading(false);
      }
    }, [hasRole]);

    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/admin/users");
        setUsers(response.data.users || []);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
      try {
        await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
        toast.success("Role updated");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to update role");
      }
    };

    const handleStatusChange = async (userId: string, isActive: boolean) => {
      try {
        await api.put(`/api/admin/users/${userId}/status`, { isActive });
        toast.success(isActive ? "User activated" : "User deactivated");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to update status");
      }
    };

    if (loading) {
      return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!hasRole("superadmin")) {
      return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Shield className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access user management.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts and roles</p>
        </div>
        <div className="grid gap-4">
          {users.map((u) => (
            <div key={u._id} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={u.profile_pic} />
                  <AvatarFallback>{u.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={u.isActive ? "default" : "destructive"}>
                  {u.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{u.role}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Change Role</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {["user", "editor", "admin", "superadmin"].map((role) => (
                      <DropdownMenuItem key={role} onClick={() => handleRoleChange(u._id, role)}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(u._id, !u.isActive)}
                >
                  {u.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                <span className="font-bold text-xs uppercase tracking-widest">Admin Dashboard</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4 overflow-y-auto no-scrollbar">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {filteredMenuItems.map((item) => {
                    const isActive = location.pathname === `/dashboard/${item.id}` || 
                                    (location.pathname === "/dashboard" && item.id === "dashboard") ||
                                    (location.pathname === "/dashboard/" && item.id === "dashboard");
                    return (
                      <SidebarMenuItem key={item.id}>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={() => navigate(`/dashboard/${item.id === "dashboard" ? "" : item.id}`)}
                                className={`h-10 rounded-md cursor-pointer transition-all duration-200 group/item ${
                                  isActive 
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                <item.icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "group-hover/item:text-primary transition-colors"}`} />
                                <span className="font-bold text-[11px] uppercase tracking-wider">{item.title}</span>
                                {item.badge && (
                                  <Badge 
                                    variant="secondary" 
                                    className={`ml-auto h-5 px-1.5 text-[10px] font-bold rounded-full border-none ${
                                      isActive 
                                        ? "bg-white/20 text-white" 
                                        : "bg-primary/10 text-primary"
                                    }`}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="md:hidden">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-3 mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-8 w-8 ring-2 ring-background">
                  <AvatarImage src={user?.profile_pic} />
                  <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-bold truncate">{user?.name || "Admin"}</span>
                  <span className="text-[9px] text-slate-500 truncate uppercase tracking-tighter">
                    {user?.role || "Editor"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-1 group-data-[collapsible=icon]:flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 cursor-pointer hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9" />
              <Separator orientation="vertical" className="h-6" />
              <h2 className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                {location.pathname === "/dashboard" || location.pathname === "/dashboard/dashboard" 
                  ? "Overview" 
                  : location.pathname.split("/").pop()?.replace("-", " ")}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                variant="default"
                size="sm"
                className="h-9 px-4 font-bold"
                onClick={handleSaveAll}
                disabled={isSaving || !hasUnsavedChanges}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-auto no-scrollbar p-6 lg:p-8">
            <div className="max-w-7xl mx-auto no-scrollbar">
              <ErrorBoundary>
                <Routes>
                  <Route index element={<DashboardOverview />} />
                  <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
                  <Route path="home" element={<HomeContentSection onSave={onSave} />} />
                  <Route path="about" element={<AboutSection onSave={onSave} />} />
                  <Route path="projects" element={<ProjectsSection onSave={onSave} />} />
                  <Route path="skills" element={<SkillsSection onSave={onSave} />} />
                  <Route path="experience" element={<ExperienceSection onSave={onSave} />} />
                  <Route path="testimonials" element={<TestimonialsSection />} />
                  <Route path="blogs" element={<BlogsSection onSave={onSave} />} />
                  <Route path="contact" element={<ContactSection onSave={onSave} />} />
                  <Route path="messages" element={<MessagesSection />} />
                  <Route path="users" element={<UsersSection />} />
                  <Route path="settings" element={<SettingsSection />} />
                </Routes>
              </ErrorBoundary>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default PortfolioDashboard;
