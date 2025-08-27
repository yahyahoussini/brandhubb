import { Link } from "react-router-dom";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { usePostsQuery } from "@/entities/post/queries";
import { Skeleton } from "@/shared/ui/skeleton";
import { usePrefetch } from "@/shared/lib/hooks/usePrefetch";
import { fetchPostBySlug } from "@/entities/post/api";
import { Post } from "@/entities/post/model";

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  return `https://vkhcmipmyqgddjnuthxb.supabase.co/storage/v1/object/public/blog-media/${path}`;
};

const PostCard = ({ post }: { post: Post }) => {
  const prefetchHandlers = usePrefetch(
    ['posts', post.slug],
    () => fetchPostBySlug(post.slug)
  );

  return (
    <article className="group">
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
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
          <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {post.published_at && format(new Date(post.published_at), 'MMM dd, yyyy')}
            </div>
            <Link to={`/blog/${post.slug}`} {...prefetchHandlers}>
              <Button variant="ghost" size="sm" className="group/btn">
                Read more
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};


const Blog = () => {
  const { data: posts, isLoading, isError } = usePostsQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6">
              <Skeleton className="w-full h-40 mb-4" />
              <Skeleton className="w-1/4 h-4 mb-2" />
              <Skeleton className="w-full h-6 mb-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-destructive mb-4">Failed to load posts</h2>
          <p className="text-muted-foreground">There was an error fetching the blog posts. Please try again later.</p>
        </div>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">No posts yet</h2>
          <p className="text-muted-foreground">Check back soon for our latest content!</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="bg-gradient-primary py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Insights, tips, and stories about design, development, and digital innovation
          </p>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-6">
          {renderContent()}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;