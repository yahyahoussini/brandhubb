import { Suspense, lazy } from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/features/auth/useAuth";
import ErrorBoundary from "./providers/ErrorBoundary";

const Index = lazy(() => import("@/pages/Index"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const BlogAdmin = lazy(() => import("@/pages/BlogAdmin"));
const BlogEditor = lazy(() => import("@/pages/BlogEditor"));
const Auth = lazy(() => import("@/pages/Auth"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const FullPageLoader = () => (
  <div className="w-screen h-screen flex items-center justify-center">
    <p>Loading...</p>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog/admin" element={<BlogAdmin />} />
              <Route path="/blog/new" element={<BlogEditor />} />
              <Route path="/blog/edit/:id" element={<BlogEditor />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
