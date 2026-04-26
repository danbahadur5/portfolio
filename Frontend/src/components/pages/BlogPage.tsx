import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, Clock, Tag, ArrowRight, Sparkles, Code2, Rocket, Heart, Coffee } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useBlogs } from "@/hooks/useBlogs";
import { LoadingSpinner } from "../LoadingSpinner";
import { Layout } from "../Layout";
import { SearchFilter } from "../SearchFilter";

export function BlogPage() {
  const { blogs = [], isLoading } = useBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(blogs.flatMap((post) => post.tags))).filter(Boolean)],
    [blogs],
  );

  const filteredPosts = useMemo(
    () =>
      blogs.filter((post) => {
        const search = searchTerm.toLowerCase();
        const matchesText =
          post.title.toLowerCase().includes(search) ||
          post.content.toLowerCase().includes(search) ||
          post.tags.some((tag) => tag.toLowerCase().includes(search));
        
        const matchesCategory = selectedCategory === "All" || post.tags.includes(selectedCategory);
        
        const matchesTech = selectedTech.length === 0 || 
          selectedTech.some(tech => post.tags.includes(tech));

        return matchesText && matchesCategory && matchesTech;
      }),
    [blogs, searchTerm, selectedCategory, selectedTech],
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Dynamic Hero Section */}
      <section className="relative responsive-section overflow-hidden">
        {/* Background Decorative Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[80px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 responsive-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 dark:bg-primary/[0.03] text-primary/80 dark:text-primary/60 text-[9px] font-bold uppercase tracking-[0.1em] mb-6 border border-primary/10 dark:border-white/10 backdrop-blur-sm shadow-sm w-fit">
              <Sparkles className="w-2.5 h-2.5" />
              The Library of Thoughts
            </div>
            <h1 className="responsive-heading-hero font-heading font-black tracking-tighter mb-6 leading-[0.95]">
              Latest <span className="text-gradient">Insights</span>
            </h1>
            <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-12">
              Exploring the intersection of <span className="text-foreground font-bold">engineering excellence</span> and <span className="text-foreground font-bold">digital craftsmanship</span>.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              selectedTech={selectedTech}
              onTechChange={setSelectedTech}
              technologies={categories.filter(c => c !== "All")}
              placeholder="Search perspectives..."
              className="mb-8 md:mb-12"
            />
          </div>
        </div>
      </section>

      {/* Articles Feed */}
      <section className="responsive-section bg-muted/20" aria-label="Articles Feed">
        <div className="responsive-container">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 md:mb-16 gap-4">
            <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tighter flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Recent Perspectives
            </h2>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-background/50 px-4 py-2 rounded-full border border-border/50">
              {filteredPosts.length} Articles Found
            </div>
          </div>

          <div className="fluid-grid">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.article
                    layout
                    key={post._id || post.id || index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <ImageWithFallback 
                        src={post.image || post.featuredImage} 
                        alt={post.title} 
                        className="img-responsive transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black uppercase tracking-widest text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 lg:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime || "5 min read"}
                        </span>
                      </div>

                      <h3 className="text-xl lg:text-2xl font-heading font-bold leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                        {post.title}
                      </h3>
                      
                      <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt || post.content.replace(/[#*`]/g, '').slice(0, 120)}...
                      </p>

                      <div className="mt-auto pt-6 border-t border-border/50">
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-transparent group/btn inline-flex items-center gap-3 touch-target focus-ring"
                          aria-label={`Read article: ${post.title}`}
                        >
                          Read Article
                          <div className="w-6 h-px bg-primary/30 group-hover/btn:w-12 group-hover/btn:bg-primary transition-all duration-500" />
                          <ArrowRight className="w-3.5 h-3.5 -translate-x-3 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-500" />
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                    <Search className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No articles found</h3>
                  <p className="responsive-text-body text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Modern Newsletter CTA */}
      <section className="responsive-section overflow-hidden relative bg-card">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="responsive-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2">
                <Coffee className="w-6 h-6" />
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-[0.95]">
                Weekly <br /> <span className="text-primary">Curations</span>
              </h2>
              <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                Join 2,000+ developers receiving deep dives into the future of digital craftsmanship.
              </p>
            </div>
            
            <div className="bg-muted/30 p-6 md:p-10 rounded-[2.5rem] border border-border/50 backdrop-blur-sm shadow-xl shadow-primary/[0.02]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email Address
                  </label>
                  <Input 
                    id="newsletter-email"
                    placeholder="architect@future.dev" 
                    className="h-14 rounded-2xl border-none bg-background shadow-inner px-6 focus-ring"
                  />
                </div>
                <Button className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all touch-target focus-ring">
                  Join the library
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest pt-2 font-bold">
                  No spam. Zero noise. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
