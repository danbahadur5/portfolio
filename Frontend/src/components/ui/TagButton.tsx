import React from "react";
import { motion } from "framer-motion";
import { cn } from "./utils"; // Assuming utils exist for tailwind-merge
import { Button } from "./button";

interface TagButtonProps {
  tagName: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  className?: string;
  variant?: "default" | "glass";
}

export const TagButton: React.FC<TagButtonProps> = ({
  tagName,
  buttonLabel,
  onButtonClick,
  className,
  variant = "default",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 w-full max-w-xs",
        className
      )}
    >
      {/* Top-aligned name label */}
      <div className="flex items-center justify-between gap-2 px-1">
        <span
          title={tagName}
          className={cn(
            "text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] truncate flex-1",
            variant === "glass" ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {tagName}
        </span>
      </div>

      {/* Button element */}
      <Button
        variant={variant === "glass" ? "outline" : "default"}
        onClick={onButtonClick}
        className={cn(
          "w-full relative group overflow-hidden transition-all duration-300",
          variant === "glass" &&
            "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/40"
        )}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {buttonLabel}
        </span>
        
        {/* Hover Sheen Effect */}
        <motion.div
          initial={false}
          whileHover={{ x: ['-100%', '200%'] }}
          transition={{ duration: 0.8, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
        />
      </Button>
    </div>
  );
};
