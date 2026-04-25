import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navigation } from "./Navigation";
import { ScrollProgress } from "./ScrollProgress";
import { BackToTop } from "./BackToTop";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navigation currentPage={currentPage} onPageChange={onPageChange} />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="pt-[5.5rem]"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div id="main-content" className="min-h-[calc(100vh-5.5rem)]">
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
