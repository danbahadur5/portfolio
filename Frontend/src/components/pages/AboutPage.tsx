import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Calendar, Code } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useAbout } from "@/hooks/useAbout";
import { LoadingSpinner } from "../LoadingSpinner";
import { useSkills } from "@/hooks/useSkills";

export function AboutPage() {
  const { data, isLoading, error } = useAbout();
  const { skills, isLoading: skillsLoading } = useSkills();
  const [activeTab, setActiveTab] = useState("about");

  const skillList = useMemo(() => skills?.technical || [], [skills]);

  if (isLoading || skillsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
        <div className="max-w-xl rounded-3xl p-10 glass-card">
          <h1 className="text-3xl font-bold mb-4">About content unavailable</h1>
          <p className="text-muted-foreground">
            Unable to load profile data right now. Refresh or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-6 lg:max-w-2xl">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                About Me
              </p>
              <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight">
                I build thoughtful digital experiences with code, design, and
                strategy.
              </h1>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
              {data.bio ||
                "A full-stack developer who turns ideas into polished products with modern technologies and clean interfaces."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Location
                </p>
                <p className="font-semibold text-foreground">
                  {data.location || "Remote / Global"}
                </p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Email
                </p>
                <p className="font-semibold text-foreground">
                  {data.email || "hello@example.com"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">
                {data.title || "Full-Stack Developer"}
              </Badge>
              <Badge variant="secondary">
                {data.name || "Portfolio Builder"}
              </Badge>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[2rem] overflow-hidden border border-border/70 bg-card shadow-2xl shadow-black/5">
            <ImageWithFallback
              src={data.profileImage || "https://via.placeholder.com/560x700"}
              alt={data.name || "Profile"}
              className="h-[420px] w-full object-cover"
            />
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                    Current Role
                  </p>
                  <p className="font-semibold text-foreground">
                    {data.title || "Software Engineer"}
                  </p>
                </div>
                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  Available
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>5+ years experience</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{data.email || "hello@example.com"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{data.location || "Remote / Global"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">
                Skillset
              </p>
              <h2 className="text-3xl font-heading font-black">
                What I enjoy building
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skillList.slice(0, 6).map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {skillList.slice(0, 6).map((skill) => (
              <div
                key={skill}
                className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <p className="text-base font-semibold text-foreground">
                  {skill}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
