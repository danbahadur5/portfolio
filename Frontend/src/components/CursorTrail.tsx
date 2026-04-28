"use client";

import { useEffect, useRef, useCallback } from "react";

interface CursorTrailProps {
  enabled?: boolean;
}

export function CursorTrail({ enabled = true }: CursorTrailProps) {
  const hasPlayedRef = useRef(false);
  const trailCountRef = useRef(0);
  const maxTrails = 50; // Limit total trail elements

  const createTrailParticle = useCallback((x: number, y: number) => {
    if (trailCountRef.current >= maxTrails) return;

    const particle = document.createElement("div");
    particle.className = "cursor-trail";
    
    // Random size between 8px and 20px
    const size = Math.random() * 12 + 8;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x - size / 2}px`;
    particle.style.top = `${y - size / 2}px`;
    
    // Random color from primary palette
    const colors = [
      "rgba(99, 102, 241, 0.6)", // Primary indigo
      "rgba(14, 165, 233, 0.6)", // Cyan accent
      "rgba(168, 85, 247, 0.6)", // Purple
      "rgba(59, 130, 246, 0.6)", // Blue
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random movement direction
    const tx = (Math.random() - 0.5) * 100;
    const ty = (Math.random() - 0.5) * 100;
    particle.style.setProperty("--tx", `${tx}px`);
    particle.style.setProperty("--ty", `${ty}px`);
    
    document.body.appendChild(particle);
    trailCountRef.current++;

    // Remove after animation
    setTimeout(() => {
      particle.remove();
      trailCountRef.current--;
    }, 1000);
  }, []);

  const createEntranceWave = useCallback(() => {
    // Create wave effect from center
    const wave = document.createElement("div");
    wave.className = "entrance-wave";
    wave.style.setProperty("--x", "50%");
    wave.style.setProperty("--y", "50%");
    document.body.appendChild(wave);

    // Create sparkle particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.className = "particle-sparkle";
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        sparkle.style.setProperty("--tx", `${tx}px`);
        sparkle.style.setProperty("--ty", `${ty}px`);
        
        const colors = [
          "rgba(99, 102, 241, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
      }, i * 50);
    }

    setTimeout(() => wave.remove(), 1500);
  }, []);

  useEffect(() => {
    if (!enabled || hasPlayedRef.current) return;

    // Check if user has already seen the effect in this session
    const sessionKey = "cursor-trail-shown";
    const hasShown = sessionStorage.getItem(sessionKey);
    
    if (hasShown) return;

    hasPlayedRef.current = true;
    sessionStorage.setItem(sessionKey, "true");

    // Trigger entrance wave on load
    setTimeout(createEntranceWave, 500);

    // Add cursor trail on mouse move (only for first 3 seconds)
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;
      createTrailParticle(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Stop creating trails after 3 seconds
    timeoutId = setTimeout(() => {
      isActive = false;
      document.removeEventListener("mousemove", handleMouseMove);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled, createEntranceWave, createTrailParticle]);

  return null; // This component doesn't render anything visible
}
