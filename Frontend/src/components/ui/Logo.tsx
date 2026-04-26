import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "monochrome" | "inverted";
  showText?: boolean;
  shortForm?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  variant = "full",
  showText = true,
  shortForm = false,
}) => {
  const sizes = {
    sm: { container: "w-8 h-8", text: "text-[10px]", mainText: "text-sm", iconSize: 20 },
    md: { container: "w-10 h-10", text: "text-xs", mainText: "text-xl", iconSize: 24 },
    lg: { container: "w-14 h-14", text: "text-sm", mainText: "text-3xl", iconSize: 32 },
    xl: { container: "w-20 h-20", text: "text-base", mainText: "text-5xl", iconSize: 48 },
  };

  const currentSize = sizes[size];

  // Color logic based on variants
  const colors = {
    full: {
      markBg: "bg-primary shadow-primary/20",
      markText: "text-primary-foreground",
      accent: "text-primary",
      subtext: "text-muted-foreground",
      border: "border-primary/20",
      gradient: "from-primary via-primary/90 to-accent",
    },
    monochrome: {
      markBg: "bg-foreground shadow-foreground/10",
      markText: "text-background",
      accent: "text-foreground",
      subtext: "text-foreground/60",
      border: "border-foreground/20",
      gradient: "from-foreground to-foreground/80",
    },
    inverted: {
      markBg: "bg-background shadow-background/10",
      markText: "text-foreground",
      accent: "text-background",
      subtext: "text-background/70",
      border: "border-background/20",
      gradient: "from-background to-background/90",
    },
  };

  const theme = colors[variant];

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <div className={`relative ${currentSize.container} flex items-center justify-center`}>
        {/* Professional SVG Mark */}
        <motion.div
          className={`absolute inset-0 rounded-2xl ${theme.markBg} shadow-xl transition-all duration-500`}
          initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          whileHover={{ rotate: 8, scale: 1.05 }}
        />
        
        {/* Subtle Inner Detail Layer */}
        <motion.div
          className={`absolute inset-0 rounded-2xl border-2 ${theme.border} scale-110`}
          initial={{ rotate: 10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          whileHover={{ rotate: -8, scale: 1.15 }}
          transition={{ duration: 0.6 }}
        />

        {/* The "DBB" Monogram SVG */}
        <svg
          width={currentSize.iconSize}
          height={currentSize.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 ${theme.markText}`}
        >
          <path
            d="M4 4H10C12.7614 4 15 6.23858 15 9V15C15 17.7614 12.7614 20 10 20H4V4Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 7H17C18.6569 7 20 8.34315 20 10V14C20 15.6569 18.6569 17 17 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <path
            d="M8 9V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`font-heading font-black tracking-tighter ${currentSize.mainText} flex items-baseline`}
          >
            <span className={`${variant === 'full' ? 'text-foreground' : theme.accent}`}>DAN</span>
            <span className={`bg-clip-text text-transparent bg-gradient-to-br ${theme.gradient} ml-1`}>
              BIST
            </span>
            <span className={theme.accent}>.</span>
          </motion.div>
          
          <motion.span
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-[9px] md:text-[10px] ${theme.subtext} font-bold uppercase tracking-[0.4em] mt-1`}
          >
            {shortForm || size === "sm" ? "FSD" : "Full Stack Developer"}
          </motion.span>
        </div>
      )}
    </div>
  );
};
