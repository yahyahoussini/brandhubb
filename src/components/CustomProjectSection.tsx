import { Button } from '@/components/ui/button';
import { Sparkles, Users, Award } from 'lucide-react';

const CustomProjectSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card text-center p-12 space-y-8">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-accent flex items-center justify-center glow-accent">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold">
            Need Something <span className="gradient-text-accent">Custom?</span>
            <br />
            Let's Build It Together.
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            One-time projects for comprehensive branding overhauls, complex web
            applications, or specialized creative campaigns. Starts at a custom
            quote based on your needs.
          </p>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-2 gap-8 py-8">
            <div className="flex items-center space-x-4">
              <Users className="w-8 h-8 text-success" />
              <div className="text-left">
                <div className="font-bold text-lg">100's of startups</div>
                <div className="text-muted-foreground text-sm">
                  trust our process
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Award className="w-8 h-8 text-success" />
              <div className="text-left">
                <div className="font-bold text-lg">7+ years</div>
                <div className="text-muted-foreground text-sm">
                  of brand expertise
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="accent"
            size="hero"
            onClick={() =>
              window.open('https://cal.com/jeevan-singh/discovery', '_blank')
            }
          >
            Book a Call
          </Button>

          {/* Fine Print */}
          <p className="text-sm text-muted-foreground">
            Custom pricing based on project scope and timeline requirements.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomProjectSection;
