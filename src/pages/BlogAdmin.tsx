import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { useTranslation } from "react-i18next";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  tags: string[] | null;
}

const BlogAdmin = () => {
  const { user, signOut, loading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    }
  };

  const togglePublished = async (postId: string, currentStatus: boolean) => {
    try {
      const updates: any = { published: !currentStatus };
      
      if (!currentStatus) {
        updates.published_at = new Date().toISOString();
      } else {
        updates.published_at = null;
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;
      
      toast.success(currentStatus ? t('blog.admin.postUnpublished') : t('blog.admin.postPublished'));
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm(t('blog.admin.confirmDelete'))) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast.success(t('blog.admin.postDeleted'));
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-24">
          <div className="text-center">{t('common.loading')}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('blog.admin.title')}</h1>
            <p className="text-muted-foreground">{t('blog.admin.subtitle')}</p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/blog/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('blog.admin.newPost')}
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              {t('blog.admin.signOut')}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">{t('blog.admin.posts')}</TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              {t('blog.admin.analytics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">{t('blog.admin.noPosts')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('blog.admin.createFirstPost')}
              </p>
              <Link to="/blog/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('blog.admin.createPost')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? t('blog.admin.published') : t('blog.admin.draft')}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePublished(post.id, post.published)}
                      >
                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Link to={`/blog/edit/${post.id}`}>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.published_at 
                      ? format(new Date(post.published_at), 'MMM dd, yyyy')
                      : format(new Date(post.created_at), 'MMM dd, yyyy')
                    }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogAdmin;