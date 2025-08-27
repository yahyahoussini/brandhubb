import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  tags: string[] | null;
  author_id: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return null;
    return `https://vkhcmipmyqgddjnuthxb.supabase.co/storage/v1/object/public/blog-media/${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-24">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-primary py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Blog
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Insights, tips, and stories about design, development, and digital innovation
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
                No posts yet
              </h2>
              <p className="text-muted-foreground">
                Check back soon for our latest content!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-elegant transition-all duration-300 group-hover:-translate-y-1">
                    {post.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.published_at && format(new Date(post.published_at), 'MMM dd, yyyy')}
                        </div>
                        
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="group/btn">
                            Read more
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Blog;