import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useBlogs } from "@/hooks/useBlogs";
import { LoadingSpinner } from "../LoadingSpinner";

export function BlogPage() {
  const { blogs = [], isLoading } = useBlogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(blogs.flatMap((post) => post.tags))).filter(Boolean),
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
        const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
        return matchesText && matchesTag;
      }),
    [blogs, searchTerm, selectedTag],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4 block">
              Knowledge Base
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter mb-6">
              Latest <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
              Deep dives into modern engineering, design systems, and the future of digital craftsmanship.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-20 z-30 py-6 px-4 sm:px-6 lg:px-8 bg-background/90 backdrop-blur-xl border-y border-border/50">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search perspectives..."
                className="w-full pl-12 pr-4 py-3"
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!selectedTag ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent text-muted-foreground"}`}
              >
                All
              </button>
              {allTags.slice(0, 5).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTag === tag ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent text-muted-foreground"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-16">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <motion.article
                key={post.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start">
                  <div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <ImageWithFallback src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4 py-2">
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>5 min read</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground font-light leading-relaxed line-clamp-3">
                      {post.content.slice(0, 200)}...
                    </p>
                    <div className="flex items-center gap-6 pt-4">
                      <Button variant="link" className="p-0 h-auto text-primary font-bold text-sm uppercase tracking-widest hover:no-underline flex items-center gap-2">
                        Read Perspective
                        <span className="block w-8 h-px bg-primary transition-all group-hover:w-12" />
                       </Button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
             <div className="text-center py-20 text-muted-foreground font-light">No articles found matching your criteria.</div>
          )}
        </div>
      </section>
    </div>
  );
}

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Get notified when I publish new articles. No spam, unsubscribe at
              any time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
