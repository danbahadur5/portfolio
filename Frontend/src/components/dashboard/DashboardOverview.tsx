import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Briefcase,
  FileText,
  Mail,
  Users,
  Star,
  Eye,
  TrendingUp,
  Loader2,
  Plus,
  ArrowUpRight,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface OverviewData {
  overview: {
    totalProjects: number;
    totalBlogs: number;
    totalMessages: number;
    unreadMessages: number;
    totalUsers: number;
    totalTestimonials: number;
    totalViews: number;
  };
  recentMessages: Array<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
  }>;
  recentBlogs: Array<{
    _id: string;
    title: string;
    status: string;
    viewCount: number;
    createdAt: string;
  }>;
}

const chartData = [
  { name: "Jan", views: 400, visitors: 240 },
  { name: "Feb", views: 300, visitors: 180 },
  { name: "Mar", views: 500, visitors: 290 },
  { name: "Apr", views: 450, visitors: 280 },
  { name: "May", views: 600, visitors: 350 },
  { name: "Jun", views: 550, visitors: 320 },
];

export function DashboardOverview() {
  const { hasPermission } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const canViewSettings = hasPermission("settings", "view");
  const canViewAnalytics = hasPermission("analytics", "view");
  const canCreateBlog = hasPermission("blogs", "create");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get("/api/dashboard/overview");
        setData(response.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const { overview } = data;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Performance metrics and recent activity across your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canViewSettings && (
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-background/50 backdrop-blur-sm" asChild>
              <Link to="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          )}
          {canCreateBlog && (
            <Button className="h-10 rounded-xl shadow-lg shadow-primary/20" asChild>
              <Link to="/dashboard/blogs">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Projects", value: overview.totalProjects, icon: Briefcase, color: "blue", trend: "+12%" },
          { title: "Active Blogs", value: overview.totalBlogs, icon: FileText, color: "emerald", sub: `${overview.totalViews.toLocaleString()} views` },
          { title: "Inquiries", value: overview.totalMessages, icon: Mail, color: "purple", badge: overview.unreadMessages },
          { title: "Testimonials", value: overview.totalTestimonials, icon: Star, color: "amber", sub: "Approved" },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-${stat.color}-500/5 group-hover:scale-150 transition-transform duration-500`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                {stat.badge !== undefined && stat.badge > 0 && (
                  <Badge variant="destructive" className="mb-1 h-5 px-1.5 rounded-full text-[10px] font-bold">
                    {stat.badge} New
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center text-xs font-medium">
                {stat.trend ? (
                  <span className="text-emerald-500 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" /> {stat.trend}
                  </span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">{stat.sub}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {canViewAnalytics && (
          <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 px-6 py-4">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Traffic Overview
                </CardTitle>
                <p className="text-xs text-slate-500">Analytics for the last 6 months</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Visitors</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: "currentColor" }}
                      className="text-slate-400"
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: "currentColor" }}
                      className="text-slate-400"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        backgroundColor: 'rgb(var(--background))' 
                      }} 
                    />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "white" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="currentColor"
                      className="text-slate-300 dark:text-slate-700"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "currentColor", strokeWidth: 2, stroke: "white" }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={`${canViewAnalytics ? "" : "lg:col-span-3"} border-none shadow-sm bg-white dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50 overflow-hidden`}>
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 px-6 py-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Recent Inquiries
              </CardTitle>
              <p className="text-xs text-slate-500">Latest contact form submissions</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {(!data.recentMessages || data.recentMessages.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">No inquiries yet</p>
                  <p className="text-xs text-slate-500 mt-1">When someone contacts you, they'll appear here.</p>
                </div>
              ) : (
                (data.recentMessages || []).slice(0, 5).map((message) => (
                  <div
                    key={message._id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{message.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1">{message.subject}</p>
                    <div className="mt-2 flex items-center justify-end">
                      <ArrowUpRight className="h-3 w-3 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
            {data.recentMessages && data.recentMessages.length > 0 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
                <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary hover:text-primary hover:bg-primary/5" asChild>
                  <Link to="/dashboard/messages">
                    View All Inquiries
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
