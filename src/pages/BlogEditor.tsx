import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  X,
  Image as ImageIcon,
  Video
} from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  video_url: string;
  published: boolean;
  seo_title: string;
  seo_description: string;
  tags: string[];
}

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isEdit = id !== undefined;
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  const [post, setPost] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: null,
    video_url: "",
    published: false,
    seo_title: "",
    seo_description: "",
    tags: []
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isEdit) {
      fetchPost();
    } else if (user) {
      // User is authenticated but not editing, loading is complete
    }
  }, [user, id]);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('author_id', user?.id)
        .single();

      if (error) throw error;
      
      setPost({
        ...data,
        tags: data.tags || [],
        excerpt: data.excerpt || "",
        video_url: data.video_url || "",
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || ""
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to fetch post');
      navigate('/blog/admin');
    } finally {
      // Loading complete after successful fetch or error
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setPost(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo_title: title
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      
      setPost(prev => ({
        ...prev,
        featured_image: fileName
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const savePost = async (publish = false) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const postData = {
        ...post,
        author_id: user.id,
        published: publish,
        published_at: publish ? new Date().toISOString() : null,
        tags: post.tags.length > 0 ? post.tags : null
      };

      if (isEdit) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();
        
        if (error) throw error;
        navigate(`/blog/edit/${data.id}`);
      }
      
      toast.success(publish ? 'Post published!' : 'Post saved as draft');
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(error.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading || (!user && !loading)) {
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
      
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/blog/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEdit ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => savePost(false)}
              disabled={saving || !post.title.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => savePost(true)}
              disabled={saving || !post.title.trim() || !post.content.trim()}
            >
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-friendly-slug"
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={post.excerpt}
                    onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Short description of your post..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={post.content}
                    onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your post content here..."
                    rows={20}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload image
                    </p>
                  </div>
                </Label>
                
                {post.featured_image && (
                  <div className="mt-4">
                    <img
                      src={`https://vkhcmipmyqgddjnuthxb.supabase.co/storage/v1/object/public/blog-media/${post.featured_image}`}
                      alt="Featured"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video URL */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={post.video_url}
                  onChange={(e) => setPost(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://example.com/video.mp4"
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    value={post.seo_title}
                    onChange={(e) => setPost(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="SEO optimized title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="seo-description">SEO Description</Label>
                  <Textarea
                    id="seo-description"
                    value={post.seo_description}
                    onChange={(e) => setPost(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="SEO meta description..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogEditor;