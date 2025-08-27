import Header from "@/components/Header";
import SocialProofTicker from "@/components/SocialProofTicker";
import HeroSection from "@/components/HeroSection";
import CapabilityMarquee from "@/components/CapabilityMarquee";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ProductPillars from "@/components/ProductPillars";
import WorkGallery from "@/components/WorkGallery";
import CustomProjectSection from "@/components/CustomProjectSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

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