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
      <ScrollProgress />
      <Navigation />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pt-16 md:pt-20"
        >
          <div className="responsive-container">
            <div id="main-content" className="min-h-[calc(100vh-10rem)]">
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
