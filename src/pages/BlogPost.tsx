import { useParams, Link } from "react-router-dom";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { usePostBySlugQuery } from "@/entities/post/queries";
import { Skeleton } from "@/shared/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = usePostBySlugQuery(slug);

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return `https://vkhcmipmyqgddjnuthxb.supabase.co/storage/v1/object/public/blog-media/${path}`;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-1/4 h-8 mb-8" />
          <Skeleton className="w-3/4 h-12 mb-6" />
          <Skeleton className="w-1/2 h-6 mb-8" />
          <Skeleton className="w-full aspect-video mb-12" />
          <Skeleton className="w-full h-96" />
        </div>
      );
    }

    if (isError || !post) {
      return (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-6">The post you are looking for does not exist or has been moved.</p>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <article>
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" className="group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <header className="mb-12 text-center">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
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
        {post.featured_image && (
          <div className="mb-12">
            <img
              src={getImageUrl(post.featured_image)}
              alt={post.title}
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-elegant"
            />
          </div>
        )}
        {post.content && (
          <div
            className="prose prose-lg max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              More Articles
            </Button>
          </Link>
        </footer>
      </article>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;