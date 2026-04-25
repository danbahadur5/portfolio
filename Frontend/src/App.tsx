import React, { useState, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { isAuthenticated } from "./utils/auth";
import { Layout } from "./components/Layout";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load page components for better performance
const HomePage = lazy(() =>
  import("./components/pages/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);
const ProjectsPage = lazy(() =>
  import("./components/pages/ProjectsPage").then((module) => ({
    default: module.ProjectsPage,
  })),
);
const AboutPage = lazy(() =>
  import("./components/pages/AboutPage").then((module) => ({
    default: module.AboutPage,
  })),
);
const BlogPage = lazy(() =>
  import("./components/pages/BlogPage").then((module) => ({
    default: module.BlogPage,
  })),
);
const ContactPage = lazy(() =>
  import("./components/pages/ContactPage").then((module) => ({
    default: module.ContactPage,
  })),
);
const LoginForm = lazy(() =>
  import("./components/pages/LoginPage").then((module) => ({
    default: module.default,
  })),
);
const PortfolioDashboard = lazy(() =>
  import("./components/PortfolioDashboard").then((module) => ({
    default: module.PortfolioDashboard,
  })),
);

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg">Loading...</span>
  </div>
);

// ✅ Protected route wrapper
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function AppRoutes({ currentPage, onPageChange }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PortfolioDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <InnerApp currentPage={currentPage} onPageChange={setCurrentPage} />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function InnerApp({
  currentPage,
  onPageChange,
}: {
  currentPage: string;
  onPageChange: (page: string) => void;
}) {
  const location = useLocation();

  useEffect(() => {
    const path =
      location.pathname === "/" ? "home" : location.pathname.replace(/^\//, "");
    onPageChange(path);
  }, [location.pathname, onPageChange]);

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50 font-bold"
      >
        Skip to main content
      </a>
      {isDashboard ? (
        <AppRoutes currentPage={currentPage} onPageChange={onPageChange} />
      ) : (
        <Layout currentPage={currentPage} onPageChange={onPageChange}>
          <AppRoutes currentPage={currentPage} onPageChange={onPageChange} />
        </Layout>
      )}
    </>
  );
}
