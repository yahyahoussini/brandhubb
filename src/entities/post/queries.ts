import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, fetchPostBySlug, fetchPostById, createPost, updatePost } from './api';
import { PostFormValues } from './model';

export function usePostsQuery() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
}

export function usePostBySlugQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: () => {
      if (!slug) throw new Error("Slug is required");
      return fetchPostBySlug(slug)
    },
    enabled: !!slug,
  });
}

export function usePostByIdQuery(id: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['posts', 'editor', id],
    queryFn: () => {
      if (!id || !userId) throw new Error("Post ID and User ID are required");
      return fetchPostById(id, userId);
    },
    enabled: !!id && !!userId,
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post, userId }: { post: PostFormValues, userId: string }) => createPost(post, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, post }: { id: string, post: PostFormValues }) => updatePost(id, post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.setQueryData(['posts', data.slug], data);
      queryClient.setQueryData(['posts', 'editor', data.id], data);
    },
  });
}
