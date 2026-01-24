import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
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
  Eye,
  Edit3,
  Save,
  Plus,
  Trash2,
  Moon,
  Sun,
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  FileText,
  Palette,
  LogOut,
  Home,
} from "lucide-react";
import { AboutSection } from "./dashboard/AboutSection";
import { HomeContentSection } from "./dashboard/HomeContentSection";
import { ProjectsSection } from "./dashboard/ProjectsSection";
import { SkillsSection } from "./dashboard/SkillsSection";
import { ExperienceSection } from "./dashboard/ExperienceSection";
import { ContactSection } from "./dashboard/ContactSection";
import { BlogsSection } from "./dashboard/BlogsSection";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import axios from "axios";

export interface PortfolioData {
  about: {
    _id: string;
    name: string;
    email: string;
    title: string;
    bio: string;
    profileImage: string;
    location: string;
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    technologies: string[];
    liveUrl: string;
    githubUrl: string;
  }>;
  skills: {
    technical: string[];
    languages: string[];
    frameworks: string[];
  };
  experience: Array<{
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    achievements: string[];
  }>;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
  blogs: Array<{
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    tags: string[];
    publishDate: string;
    published: boolean;
  }>;
}

const initialData: PortfolioData = {
  about: {
    _id: "",
    name: "",
    title: "",
    bio: "",
    profileImage: "",
    location: "",
    email: "",
  },
  projects: [],
  skills: {
    technical: [],
    languages: [],
    frameworks: [],
  },
  experience: [],
  contact: {
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    twitter: "",
    website: "",
  },
  blogs: [],
};

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    id: "home",
    title: "Home Content",
    icon: Home,
    description: "Home page content",
  },
  {
    id: "about",
    title: "About",
    icon: User,
    description: "Personal information",
  },
  {
    id: "projects",
    title: "Projects",
    icon: Briefcase,
    description: "Portfolio projects",
  },
  {
    id: "skills",
    title: "Skills",
    icon: GraduationCap,
    description: "Technical skills",
  },
  {
    id: "experience",
    title: "Experience",
    icon: Briefcase,
    description: "Work history",
  },
  {
    id: "blogs",
    title: "Blogs",
    icon: FileText,
    description: "Articles and posts",
  },
  {
    id: "contact",
    title: "Contact",
    icon: Mail,
    description: "Contact information",
  },
];

export function PortfolioDashboard() {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const fetchAbout = async () => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    return await axios.get(`${backend}/api/getabout`);
  };

  fetchAbout().then((res) => {
    data.about = res.data.about[0];
  });

  const fetchSkills = async () => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    return await axios.get(`${backend}/api/getskill`);
  };

  fetchSkills().then((res) => {
    data.skills = res.data.skill[0];
  });
  const fetchExperience = async () => {
    const backend = import.meta.env.VITE_BACKEND_URL;
    return await axios.get(`${backend}/api/getexperience`);
  };

  fetchExperience().then((res) => {
    data.experience = res.data.experience[0];
  });

  const updateData = (section: keyof PortfolioData, newData: any) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log("Saving data:", data);
    setHasUnsavedChanges(false);
    // Show success message
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "home":
        return <HomeContentSection />;
      case "about":
        return <AboutSection />;
      case "projects":
        return <ProjectsSection />;
      case "skills":
        return <SkillsSection />;
      case "experience":
        return <ExperienceSection />;
      case "blogs":
        return <BlogsSection />;
      case "contact":
        return <ContactSection />;
      default:
        return <DashboardOverview />;
    }
  };

  const activeMenuItem = menuItems.find((item) => item.id === activeSection);

  return (
    <SidebarProvider>
      <div
        className={`flex min-h-screen w-full bg-background ${
          isDarkMode ? "dark" : ""
        }`}
      >
        {/* Sidebar */}
        <Sidebar className="border-r fixed top-0 left-0 h-full  overflow-y-auto">
          <SidebarHeader className="border-b px-7 py-4 w-full">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Portfolio</h2>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <div>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Portfolio Sections</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveSection(item.id)}
                          isActive={activeSection === item.id}
                          className="w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarFooter>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="flex items-center justify-between gap-3  bg-card px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          data.about?.profileImage || "/placeholder-avatar.png"
                        }
                        alt="avatar"
                        className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {data.about?.name ?? "User"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          Admin
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Settings"
                        onClick={() => setActiveSection("settings")}
                        className="inline-flex items-center justify-center p-2 rounded-md hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <Settings className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="Logout"
                        onClick={() => {
                          localStorage.setItem("isLoggedIn", "false");
                          navigate("/");
                        }}
                        className="inline-flex items-center  cursor-pointer justify-center p-2 rounded-md hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2  focus:ring-red-200"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </SidebarFooter>
            </SidebarContent>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-1 flex-col ml-[280px]">
          {/* Header */}
          <header className="border-b bg-card  sticky top-0 z-10 shrink-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-semibold">
                    {activeMenuItem?.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {activeMenuItem?.description}
                  </p>
                </div>
                {hasUnsavedChanges && (
                  <span className="text-sm text-orange-600 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
                    Unsaved changes
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate("/")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  className="bg-primary text-primary-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1">
            <div className="p-6">{renderContent()}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
