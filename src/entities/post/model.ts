import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string().nullable(),
  excerpt: z.string().nullable(),
  featured_image: z.string().nullable(),
  published_at: z.string().datetime().nullable(),
  tags: z.array(z.string()).nullable(),
  author_id: z.string(),
  published: z.boolean().optional(),
  video_url: z.string().url().nullable().optional(),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
});

export const PostFormSchema = PostSchema.pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  featured_image: true,
  published: true,
  tags: true,
  video_url: true,
  seo_title: true,
  seo_description: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export type Post = z.infer<typeof PostSchema>;
export type PostFormValues = z.infer<typeof PostFormSchema>;
