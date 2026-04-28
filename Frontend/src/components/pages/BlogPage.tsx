import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 responsive-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 border border-primary/20 backdrop-blur-sm shadow-sm w-fit">
              <Sparkles className="w-3 h-3" />
              The Library of Thoughts
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter mb-8 leading-[0.95] text-balance">
              Latest <span className="text-gradient">Insights</span>
            </h1>
            <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto mb-16 text-pretty">
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
              className="mb-12 md:mb-16"
            />
          </div>
        </div>
      </section>

      {/* Articles Feed */}
      <section className="responsive-section bg-muted/30 dark:bg-muted/10 border-y border-primary/5" aria-label="Articles Feed">
        <div className="responsive-container">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-16 md:mb-24 gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tighter flex items-center justify-center sm:justify-start gap-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                Recent Perspectives
              </h2>
              <p className="text-muted-foreground font-medium text-sm md:text-base">Deep dives into the latest in technology and design.</p>
            </div>
            <div className="text-[12px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-6 py-3 rounded-full border border-primary/20 shadow-lg shadow-primary/5">
              {filteredPosts.length} Articles Found
            </div>
          </div>

          <div className="grid-portfolio">
            <AnimatePresence mode="popLayout">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.article
                    layout
                    key={post._id || post.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative flex flex-col bg-card/50 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-primary/5 dark:border-white/5 shadow-2xl transition-all duration-700 h-full hover-lift group/blog-card"
                  >
                    {/* Decorative Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover/blog-card:opacity-100 transition-opacity duration-700" />

                    <div className="aspect-video overflow-hidden relative isolation-isolate rounded-t-[inherit]">
                      <ImageWithFallback 
                        src={post.image || post.featuredImage} 
                        alt={post.title} 
                        className="img-responsive transition-transform duration-[1.5s] ease-out group-hover/blog-card:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/blog-card:opacity-60 transition-opacity duration-700" />
                      
                      <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10 flex flex-col flex-1 relative">
                      <div className="flex items-center gap-4 mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt || post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {post.readTime || "5 min read"}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black leading-tight mb-6 group-hover/blog-card:text-primary transition-colors duration-500 line-clamp-2 tracking-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8 line-clamp-3">
                        {post.excerpt || post.content.replace(/[#*`]/g, '').slice(0, 140)}...
                      </p>

                      <div className="mt-auto pt-8 border-t border-primary/5 flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-primary font-black text-[12px] uppercase tracking-[0.2em] hover:bg-transparent group/btn inline-flex items-center gap-4 touch-target focus-ring"
                          aria-label={`Read article: ${post.title}`}
                        >
                          Read Article
                          <div className="w-8 h-px bg-primary/30 group-hover/btn:w-16 group-hover/btn:bg-primary transition-all duration-700" />
                          <ArrowRight className="w-4 h-4 -translate-x-4 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-700" />
                        </Button>
                        <div className="flex items-center gap-2 text-muted-foreground/40 group-hover/blog-card:text-primary/40 transition-colors duration-700">
                          <Heart className="w-4 h-4" />
                          <span className="text-xs font-bold">24</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-48 text-center"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-muted mb-8 shadow-inner">
                    <Search className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">No articles found</h3>
                  <p className="responsive-text-body text-muted-foreground font-medium max-w-md mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Modern Newsletter CTA */}
      <section className="responsive-section overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-primary/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="responsive-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-2 shadow-xl shadow-primary/5">
                <Coffee className="w-8 h-8" />
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-[0.85]">
                Weekly <br /> <span className="text-gradient">Curations</span>
              </h2>
              <p className="responsive-text-body text-muted-foreground font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                Join <span className="text-foreground font-bold">2,000+ developers</span> receiving deep dives into the future of digital craftsmanship.
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-primary/5 shadow-2xl hover-lift transition-all duration-700">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="newsletter-email" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-4">
                    Email Address
                  </label>
                  <Input 
                    id="newsletter-email"
                    placeholder="architect@future.dev" 
                    className="h-16 rounded-[1.5rem] border-primary/10 bg-background/50 shadow-inner px-8 focus-ring text-lg font-medium placeholder:text-muted-foreground/30"
                  />
                </div>
                <Button className="w-full h-16 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 hover:scale-[1.02] active:scale-95">
                  Join the library
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                    No spam. Zero noise. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
