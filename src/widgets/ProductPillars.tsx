import { 
  Trello, 
  DollarSign, 
  Clock, 
  ArrowUpDown 
} from "lucide-react";

const ProductPillars = () => {
  const pillars = [
    {
      icon: Trello,
      title: "Design Board",
      description: "Track and manage all your requests in one Trello board.",
      features: ["Real-time updates", "Priority queue", "File sharing", "Progress tracking"]
    },
    {
      icon: DollarSign,
      title: "Fixed Monthly Rate", 
      description: "Same price each month, no guesswork.",
      features: ["No hidden fees", "Transparent pricing", "Budget predictability", "Value guarantee"]
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Drop a request, get it back in a few days.",
      features: ["1-3 day turnaround", "48h progress updates", "Quality assurance", "Rush options"]
    },
    {
      icon: ArrowUpDown,
      title: "Flexible and Scalable",
      description: "Whether you need less or more, we're ready.",
      features: ["Pause anytime", "Scale up/down", "Team expansion", "Custom solutions"]
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Built to raise your{" "}
            <span className="gradient-text">standards forever</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our service model is designed around your success, with features that scale with your business.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="group">
                <div className="glass-card card-hover text-center space-y-6 h-full p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 border-t border-white/10">
                    <ul className="space-y-2 text-sm text-left">
                      {pillar.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass-card inline-block px-8 py-4">
            <p className="text-sm">
              <span className="gradient-text font-semibold">Ready to experience the difference?</span> 
              Join hundreds of satisfied clients today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPillars;