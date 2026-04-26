import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";

interface PolaroidProps {
  text: string;
  rotation: number;
  bgGradient: string;
  delay: number;
  label: string;
}

const PolaroidFrame: React.FC<PolaroidProps> = ({ text, rotation, bgGradient, delay, label }) => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotation - 5 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ 
        delay, 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        zIndex: 50,
        transition: { duration: 0.3 }
      }}
      className="relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm w-full sm:max-w-none mx-auto"
      tabIndex={0}
      role="img"
      aria-label={label}
    >
      {/* Polaroid Container */}
      <div className="bg-white p-0.5 sm:p-2 pb-3 sm:pb-8 shadow-xl shadow-black/10 group-hover:shadow-2xl group-hover:shadow-black/20 transition-shadow duration-300">
        {/* Photo Area */}
        <div className={`aspect-[4/1] sm:aspect-square w-full ${bgGradient} relative overflow-hidden flex items-center justify-center p-1 sm:p-4 text-center`}>
          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none" />
          
          {/* Handwriting Text */}
          <span className="font-['Caveat'] text-sm xs:text-base md:text-2xl font-bold text-slate-800 leading-tight select-none px-2">
            {text}
          </span>
        </div>

        {/* Caption Area */}
        <div className="absolute bottom-0.5 sm:bottom-2 left-1 sm:left-3 right-1 sm:right-3 flex items-center justify-between text-[5px] sm:text-[9px] font-medium text-slate-400 font-sans uppercase tracking-[0.1em]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {currentYear}
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Collab
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PolaroidFrames: React.FC<{ name?: string; position?: string }> = ({ 
  name = "Dan Bahadur Bist", 
  position = "Full Stack Developer" 
}) => {
  const frames = [
    {
      text: "Open for Collaboration",
      rotation: -3,
      bgGradient: "bg-gradient-to-br from-emerald-50 to-teal-100",
      label: "Status: Open for Collaboration"
    },
    {
      text: position,
      rotation: 2,
      bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
      label: `Role: ${position}`
    },
    {
      text: name,
      rotation: -1.5,
      bgGradient: "bg-gradient-to-br from-amber-50 to-orange-100",
      label: `Name: ${name}`
    }
  ];

  return (
    <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-6 items-center justify-center max-w-2xl mx-auto px-0 sm:px-4 py-1 sm:py-8">
      {frames.map((frame, index) => {
        // Only show the name frame (index 2) on mobile
        const isNameFrame = index === 2;
        return (
          <div 
            key={index} 
            className={`
              ${isNameFrame ? "flex" : "hidden sm:flex"} 
              ${index === 2 ? "sm:col-span-1" : ""}
              w-full justify-center
            `}
          >
            <PolaroidFrame
              {...frame}
              delay={0.5 + index * 0.15}
            />
          </div>
        );
      })}
    </div>
  );
};
