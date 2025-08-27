import Header from "@/widgets/Header";
import SocialProofTicker from "@/widgets/SocialProofTicker";
import HeroSection from "@/widgets/HeroSection";
import CapabilityMarquee from "@/widgets/CapabilityMarquee";
import ProcessSection from "@/widgets/ProcessSection";
import TestimonialsCarousel from "@/widgets/TestimonialsCarousel";
import ProductPillars from "@/widgets/ProductPillars";
import WorkGallery from "@/widgets/WorkGallery";
import CustomProjectSection from "@/widgets/CustomProjectSection";
import PricingSection from "@/widgets/PricingSection";
import FAQSection from "@/widgets/FAQSection";
import Footer from "@/widgets/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <Header />
      
      {/* Social Proof Ticker */}
      <SocialProofTicker />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Capability Marquee */}
      <CapabilityMarquee />
      
      {/* Process Section */}
      <ProcessSection />
      
      {/* Testimonials */}
      <TestimonialsCarousel />
      
      {/* Product Pillars */}
      <ProductPillars />
      
      {/* Work Gallery */}
      <WorkGallery />
      
      {/* Custom Projects */}
      <CustomProjectSection />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* FAQ */}
      <FAQSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;