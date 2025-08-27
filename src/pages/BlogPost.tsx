import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  video_url: string | null;
  published_at: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  author_id: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      setError(error.message);
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

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* SEO Meta Tags */}
      {post.seo_title && (
        <title>{post.seo_title}</title>
      )}
      {post.seo_description && (
        <meta name="description" content={post.seo_description} />
      )}
      
      <article className="py-12">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-12 text-center">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {post.published_at && format(new Date(post.published_at), 'MMMM dd, yyyy')}
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-12">
              <img
                src={getImageUrl(post.featured_image)}
                alt={post.title}
                className="w-full max-w-4xl mx-auto rounded-2xl shadow-elegant"
              />
            </div>
          )}

          {/* Video */}
          {post.video_url && (
            <div className="mb-12">
              <div className="relative w-full max-w-4xl mx-auto aspect-video">
                <video
                  src={post.video_url}
                  controls
                  className="w-full h-full rounded-2xl"
                  poster={post.featured_image ? getImageUrl(post.featured_image) : undefined}
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-4xl mx-auto">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="leading-relaxed"
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                More Articles
              </Button>
            </Link>
          </footer>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;