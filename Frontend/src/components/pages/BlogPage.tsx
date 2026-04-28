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
      <section className="relative responsive-section overflow-hidden bg-gradient-to-b from-muted/20 to-muted/40 dark:from-muted/10 dark:to-muted/20">
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
                    className="group relative flex flex-col bg-card/50 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-primary/5 dark:border-white/5 shadow-2xl transition-all duration-700 h-full hover-lift group/blog-card"
                  >
                    {/* Decorative Glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover/blog-card:opacity-100 transition-opacity duration-700" />

                    <div className="aspect-[16/10] overflow-hidden relative isolation-isolate rounded-t-[inherit]">
                      <ImageWithFallback 
                        src={post.image || post.featuredImage} 
                        alt={post.title} 
                        className="img-responsive transition-transform duration-[1.5s] ease-out group-hover/blog-card:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-60 group-hover/blog-card:opacity-80 transition-all duration-700 flex items-end p-4 lg:p-6">
                        <div className="text-white transform translate-y-2 group-hover/blog-card:translate-y-0 transition-transform duration-700">
                          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary mb-1.5 block">
                            {post.tags?.[0] || "Article"}
                          </span>
                          <h3 className="text-lg lg:text-xl xl:text-2xl font-black tracking-tighter leading-tight line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 relative">
                      <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt || post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-primary/20" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime || "5 min read"}
                        </span>
                      </div>

                      <p className="text-sm lg:text-base text-muted-foreground font-medium leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt || post.content.replace(/[#*`]/g, '').slice(0, 140)}...
                      </p>

                      <div className="mt-auto pt-4 border-t border-primary/5 flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          className="p-0 h-auto text-primary font-black text-[9px] uppercase tracking-[0.2em] hover:bg-transparent group/btn inline-flex items-center gap-2 touch-target focus-ring"
                          aria-label={`Read article: ${post.title}`}
                        >
                          Read Article
                          <div className="w-6 h-px bg-primary/30 group-hover/btn:w-10 group-hover/btn:bg-primary transition-all duration-700" />
                          <ArrowRight className="w-3 h-3 -translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-700" />
                        </Button>
                        <div className="flex items-center gap-1.5 text-muted-foreground/40 group-hover/blog-card:text-primary/40 transition-colors duration-700">
                          <Heart className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">24</span>
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
    </Layout>
  );
}
