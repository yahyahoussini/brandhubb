import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* 404 Graphic */}
        <div className="mb-12">
          <div className="text-9xl md:text-[12rem] font-black gradient-text opacity-50">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold">
            Page <span className="gradient-text">not found</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => window.location.href = "/"}
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-muted-foreground mt-8">
          Need help? Contact us at{" "}
          <a href="mailto:info@brandhub.co.ke" className="text-accent hover:underline">
            info@brandhub.co.ke
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
