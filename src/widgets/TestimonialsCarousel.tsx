import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/shared/ui/button";

const testimonials = [
  {
    name: "Eren",
    company: "Zeylana",
    quote: "BrandHUB transformed our brand completely. The quality and speed of delivery is unmatched. Our conversion rates increased by 40% after the rebrand.",
    rating: 5
  },
  {
    name: "Immaculate", 
    company: "IA",
    quote: "Working with BrandHUB has been a game-changer. Their design subscription model gives us the flexibility we need to scale our marketing efforts.",
    rating: 5
  },
  {
    name: "Hassan",
    company: "GivTrade", 
    quote: "The team at BrandHUB understands our vision perfectly. Every design deliverable exceeds expectations and arrives on time, every time.",
    rating: 5
  },
  {
    name: "Arif",
    company: "ChaiFlow",
    quote: "From logo to landing pages, BrandHUB handles it all. The unlimited revisions policy means we get exactly what we want, when we want it.",
    rating: 5
  },
  {
    name: "Nawid",
    company: "Modern Alchemist",
    quote: "I've worked with many agencies, but none match BrandHUB's combination of creativity, efficiency, and professionalism. Highly recommended!",
    rating: 5
  },
  {
    name: "Riccardo",
    company: "Eram Clinic",
    quote: "BrandHUB's subscription model is perfect for our healthcare practice. We get consistent, professional designs that help build trust with our patients.",
    rating: 5
  }
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            What our <span className="gradient-text">clients say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted by hundreds of startups and established companies worldwide.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card text-center space-y-8 p-12 card-hover">
            {/* Rating Stars */}
            <div className="flex justify-center space-x-1 mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star 
                  key={index} 
                  className="w-6 h-6 fill-accent text-accent" 
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Attribution */}
            <div className="space-y-2">
              <div className="font-bold text-xl gradient-text">
                {currentTestimonial.name}
              </div>
              <div className="text-muted-foreground">
                {currentTestimonial.company}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="glass"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="glass"
              size="icon"  
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;