import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SiteProvider } from "./contexts/SiteContext";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

const HomePage = lazy(() => import("./components/pages/HomePage").then(m => ({ default: m.HomePage })));
const ProjectsPage = lazy(() => import("./components/pages/ProjectsPage").then(m => ({ default: m.ProjectsPage })));
const AboutPage = lazy(() => import("./components/pages/AboutPage").then(m => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import("./components/pages/BlogPage").then(m => ({ default: m.BlogPage })));
const ContactPage = lazy(() => import("./components/pages/ContactPage").then(m => ({ default: m.ContactPage })));
const LoginPage = lazy(() => import("./components/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const PortfolioDashboard = lazy(() => import("./components/PortfolioDashboard").then(m => ({ default: m.PortfolioDashboard })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg">Loading...</span>
  </div>
);

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user, hasRole, token } = useAuth();
  
  // If we have a token but user info isn't loaded yet, show loader
  if (token && !user) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/system/portal/secure-access" element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={["admin", "superadmin", "editor"]}>
              <PortfolioDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SiteProvider>
            <Router>
              <AppRoutes />
            </Router>
          </SiteProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
