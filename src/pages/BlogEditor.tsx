import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/useAuth";
import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Switch } from "@/shared/ui/switch";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PostFormSchema, PostFormValues } from "@/entities/post/model";
import {
  usePostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/entities/post/queries";

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isEdit = !!id;

  const { data: existingPost, isLoading: isFetchingPost } = usePostByIdQuery(id, user?.id);
  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured_image: null,
      video_url: "",
      published: false,
      seo_title: "",
      seo_description: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isEdit && existingPost) {
      reset(existingPost);
    }
  }, [isEdit, existingPost, reset]);

  const onSubmit = async (values: PostFormValues) => {
    const mutation = isEdit ? updatePostMutation : createPostMutation;
    const variables = isEdit ? { id, post: values } : { post: values, userId: user!.id };

    try {
      // @ts-expect-error
      const result = await mutation.mutateAsync(variables);
      toast.success(`Post ${isEdit ? 'updated' : 'created'} successfully!`);
      if (!isEdit) {
        navigate(`/blog/edit/${result.id}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} post.`;
      toast.error(errorMessage);
    }
  };

  if (authLoading || isFetchingPost) {
    return (
      <div className="min-h-screen"><Header />
        <main className="container mx-auto px-6 py-24 text-center">Loading...</main>
      <Footer /></div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Post' : 'New Post'}</h1>
            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update' : 'Create'} Post
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} />
                    {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" {...register("slug")} />
                    {errors.slug && <p className="text-destructive text-sm mt-1">{errors.slug.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" {...register("content")} rows={15} />
                    {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea id="excerpt" {...register("excerpt")} />
                  </div>
                   <div>
                    <Label htmlFor="published">Published</Label>
                    <Controller
                        name="published"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-2"
                          />
                        )}
                      />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default BlogEditor;