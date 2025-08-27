-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  featured_image TEXT,
  video_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Authors can manage their own posts" 
ON public.blog_posts 
FOR ALL 
USING (auth.uid() = author_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for blog media
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-media', 'blog-media', true);

-- Create policies for blog media uploads
CREATE POLICY "Anyone can view blog media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-media');

CREATE POLICY "Authenticated users can upload blog media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their blog media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authors can delete their blog media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-media' AND auth.uid() IS NOT NULL);

-- Create index for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);