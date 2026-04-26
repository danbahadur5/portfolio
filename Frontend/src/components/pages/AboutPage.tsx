import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Code2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Terminal,
  Cpu,
  Globe
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useAbout } from "@/hooks/useAbout";
import { useSkills } from "@/hooks/useSkills";
import { LoadingSpinner } from "../LoadingSpinner";
import { Layout } from "../Layout";

export function AboutPage() {
  const { data, isLoading, error } = useAbout();
  const { skills, isLoading: skillsLoading } = useSkills();
  const [activeTab, setActiveTab] = useState("story");

  const skillCategories = useMemo(() => {
    if (!skills) return [];
    return [
      { 
        name: "Technical Stack", 
        items: skills.technical || [], 
        icon: <Code2 className="w-4 h-4" />,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      },
      { 
        name: "Frameworks", 
        items: skills.frameworks || [], 
        icon: <Layers className="w-4 h-4" />,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
      },
      { 
        name: "Tools & Others", 
        items: skills.others || [], 
        icon: <Terminal className="w-4 h-4" />,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
      }
    ].filter(cat => cat.items.length > 0);
  }, [skills]);

  if (isLoading || skillsLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-background px-4 text-center">
          <div className="max-w-xl rounded-[2.5rem] p-12 glass border border-border/50">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-heading font-black mb-4">Profile Unavailable</h1>
            <p className="text-muted-foreground font-light mb-8">
              We couldn't retrieve the profile data. This might be a temporary connection issue.
            </p>
            <Button onClick={() => window.location.reload()} className="rounded-full px-8">
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative responsive-section overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative z-10 responsive-container">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary/20 touch-target">
                  <Sparkles className="w-3 h-3" />
                  Digital Craftsman
                </div>
                <h1 className="responsive-heading-hero font-heading font-black tracking-tighter mb-8 leading-[0.9]">
                  About <span className="text-gradient">Me.</span>
                </h1>
                <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {data.title || "Full-Stack Developer"} based in <span className="text-foreground font-bold">{data.location || "the digital realm"}</span>. 
                  I transform complex problems into <span className="text-foreground font-bold">elegant digital solutions</span>.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <div className="flex items-center gap-6 p-1 pr-6 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm shadow-sm touch-target">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/20">
                    <ImageWithFallback src={data.profile_pic} alt={data.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Currently</span>
                    <span className="text-xs md:text-sm font-bold">{data.title || "Exploring new horizons"}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-[6px] md:border-8 border-card shadow-2xl relative group">
                  <ImageWithFallback
                    src={data.profile_pic}
                    alt={data.name}
                    className="img-responsive grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                    <div className="p-4 md:p-6 rounded-2xl glass-dark border border-white/10 backdrop-blur-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{data.name}</h3>
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-black uppercase tracking-widest px-2 py-1">
                          Available
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-white/70">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {data.location}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/70">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate">{data.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" aria-hidden="true" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700" aria-hidden="true" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="responsive-section bg-muted/20">
        <div className="responsive-container">
          <Tabs defaultValue="story" className="w-full" onValueChange={setActiveTab}>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              {/* Tab Navigation */}
              <div className="lg:w-1/3 space-y-8">
                <div className="space-y-4 text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter">
                    The <span className="text-primary">Journey.</span>
                  </h2>
                  <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed">
                    Explore my professional narrative, technical arsenal, and the experiences that shaped my career.
                  </p>
                </div>

                <TabsList className="flex flex-col h-auto bg-transparent gap-3 p-0">
                  <TabsTrigger 
                    value="story"
                    className="justify-start px-6 py-4 rounded-2xl border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all group touch-target focus-ring"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${activeTab === 'story' ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-base tracking-tight">My Story</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Bio & Philosophy</span>
                      </div>
                    </div>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="skills"
                    className="justify-start px-6 py-4 rounded-2xl border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all group touch-target focus-ring"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${activeTab === 'skills' ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-base tracking-tight">Tech Stack</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Tools & Capabilities</span>
                      </div>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger 
                    value="experience"
                    className="justify-start px-6 py-4 rounded-2xl border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all group touch-target focus-ring"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${activeTab === 'experience' ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-base tracking-tight">Experience</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">Professional Timeline</span>
                      </div>
                    </div>
                  </TabsTrigger>
                </TabsList>

                {/* Stats Card */}
                <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 shadow-sm space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Quick Facts</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-heading font-black">5+</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Years Exp.</div>
                    </div>
                    <div>
                      <div className="text-3xl font-heading font-black">50+</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Projects</div>
                    </div>
                    <div>
                      <div className="text-3xl font-heading font-black">12+</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Client Countries</div>
                    </div>
                    <div>
                      <div className="text-3xl font-heading font-black">∞</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Coffee Cups</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="lg:w-2/3">
                <AnimatePresence mode="wait">
                  <TabsContent value="story" className="m-0 mt-0 outline-none">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <Card className="rounded-[2.5rem] border-none shadow-none bg-transparent">
                        <CardContent className="p-0 space-y-8">
                          <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h3 className="text-3xl font-bold mb-6">Building the Future, One Line at a Time.</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed font-light mb-6">
                              {data.bio || "My journey in technology started with a simple curiosity about how things work on the web. Over the years, that curiosity evolved into a professional passion for creating high-performance, user-centric applications."}
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed font-light">
                              I believe that great software isn't just about code—it's about understanding human needs and translating them into seamless digital experiences. Whether it's a complex backend architecture or a pixel-perfect user interface, I approach every project with meticulous attention to detail and a commitment to excellence.
                            </p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm group hover:border-primary/30 transition-colors">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="w-6 h-6" />
                              </div>
                              <h4 className="text-xl font-bold mb-2">Philosophy</h4>
                              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                Scalability, maintainability, and accessibility are at the core of everything I build.
                              </p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm group hover:border-accent/30 transition-colors">
                              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Terminal className="w-6 h-6" />
                              </div>
                              <h4 className="text-xl font-bold mb-2">Methodology</h4>
                              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                Agile-driven development with a focus on continuous integration and rapid delivery.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="skills" className="m-0 mt-0 outline-none">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-12"
                    >
                      <div className="grid gap-8">
                        {skillCategories.map((category, idx) => (
                          <div key={category.name} className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl ${category.bg} ${category.color}`}>
                                {category.icon}
                              </div>
                              <h3 className="text-xl font-bold">{category.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {category.items.map((skill, sIdx) => (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1 + sIdx * 0.05 }}
                                  key={skill}
                                >
                                  <Badge 
                                    variant="secondary" 
                                    className="px-4 py-2 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all cursor-default text-sm font-medium"
                                  >
                                    {skill}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-10 rounded-[2.5rem] bg-primary text-primary-foreground relative overflow-hidden group">
                        <div className="relative z-10">
                          <h3 className="text-3xl font-heading font-black mb-4">Always Learning.</h3>
                          <p className="text-primary-foreground/80 font-light leading-relaxed max-w-xl mb-8">
                            Currently exploring Advanced WebAssembly patterns and the evolution of Edge Computing. I believe in staying ahead of the curve to provide the best solutions.
                          </p>
                          <Button variant="secondary" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                            View Roadmap
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="experience" className="m-0 mt-0 outline-none">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {/* Timeline Item 1 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors group-hover:border-primary/50">
                            <Briefcase className="w-4 h-4 text-primary" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm group-hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <time className="text-[10px] font-black uppercase tracking-widest text-primary">2021 - Present</time>
                              <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">Remote</Badge>
                            </div>
                            <div className="text-xl font-bold mb-1">Senior Software Engineer</div>
                            <div className="text-sm text-muted-foreground font-medium mb-4">TechInnovate Solutions</div>
                            <p className="text-sm text-muted-foreground font-light leading-relaxed">
                              Leading a team of 5 developers in architecting and implementing large-scale cloud applications using React and Node.js.
                            </p>
                          </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors group-hover:border-primary/50">
                            <Briefcase className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm group-hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <time className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">2019 - 2021</time>
                            </div>
                            <div className="text-xl font-bold mb-1">Full-Stack Developer</div>
                            <div className="text-sm text-muted-foreground font-medium mb-4">Digital Pulse Agency</div>
                            <p className="text-sm text-muted-foreground font-light leading-relaxed">
                              Developed and maintained multiple client projects, focusing on performance optimization and responsive design.
                            </p>
                          </div>
                        </div>

                        {/* Timeline Item 3 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors group-hover:border-primary/50">
                            <GraduationCap className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm group-hover:border-primary/30 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <time className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">2015 - 2019</time>
                            </div>
                            <div className="text-xl font-bold mb-1">B.Sc. in Computer Science</div>
                            <div className="text-sm text-muted-foreground font-medium mb-4">University of Technology</div>
                            <p className="text-sm text-muted-foreground font-light leading-relaxed">
                              Graduated with Honors, specializing in Software Engineering and Distributed Systems.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tighter">
              Let's build <br /> <span className="text-gradient">Something Great.</span>
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              I'm always open to new opportunities, collaborations, or just a friendly chat about technology.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="rounded-full h-16 px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Start a Project
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-border/50 hover:bg-primary/5 hover:text-primary transition-all">
                <Github className="w-6 h-6" />
              </Button>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-border/50 hover:bg-primary/5 hover:text-primary transition-all">
                <Linkedin className="w-6 h-6" />
              </Button>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-border/50 hover:bg-primary/5 hover:text-primary transition-all">
                <Twitter className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
