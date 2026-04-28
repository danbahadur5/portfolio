import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { ScrollProgress } from "./ScrollProgress";
import { BackToTop } from "./BackToTop";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:font-black focus:uppercase focus:tracking-widest focus:shadow-2xl transition-all"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <Navigation />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          id="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pt-16 md:pt-20"
          role="main"
          aria-label="Main content"
        >
          <div className="responsive-container">
            <div className="min-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </div>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <BackToTop />
    </div>
  );
}
