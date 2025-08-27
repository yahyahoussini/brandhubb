import { supabase } from '@/shared/api/supabase/client';
import { PostSchema } from './model';
import { z } from 'zod';

export async function fetchPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Safely parse the data
  const posts = z.array(PostSchema).safeParse(data);

  if (!posts.success) {
    console.error(posts.error);
    throw new Error('Failed to parse blog posts from the server.');
  }

  return posts.data;
}

export async function fetchPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const post = PostSchema.safeParse(data);

  if (!post.success) {
    console.error(post.error);
    throw new Error(`Failed to parse post (slug: ${slug}) from the server.`);
  }

  return post.data;
}

export async function fetchPostById(id: string, userId: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('author_id', userId)
    .single();

  if (error) throw new Error(error.message);
  return PostSchema.parse(data);
}

export async function createPost(post: Omit<Post, 'id' | 'author_id' | 'published_at'>, userId: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...post, author_id: userId }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return PostSchema.parse(data);
}

export async function updatePost(id: string, post: Omit<Post, 'id' | 'author_id' | 'published_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return PostSchema.parse(data);
}
