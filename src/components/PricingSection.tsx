import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, ExternalLink } from "lucide-react";
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const { t } = useTranslation();
  
  const plans = [
    {
      name: t('pricing.standard.name'),
      price: "$2,997",
      period: "per month",
      description: "Perfect for startups and growing businesses",
      features: t('pricing.standard.features', { returnObjects: true }) as string[],
      cta: t('pricing.standard.cta'),
      popular: false,
      icon: Zap
    },
    {
      name: t('pricing.plus.name'), 
      price: "$4,997",
      period: "per month",
      description: "For established companies needing video content",
      features: t('pricing.plus.features', { returnObjects: true }) as string[],
      cta: t('pricing.plus.cta'),
      popular: true,
      icon: Crown
    }
  ];

  const handleSubscribe = (planName: string) => {
    // This would connect to Stripe Checkout
    window.open('https://buy.stripe.com', '_blank');
  };

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Unlimited work, one request at a time. Pause or cancel anytime.
          </p>
          
          {/* Trial Info */}
          <div className="glass-card inline-block px-8 py-4 mb-12">
            <p className="text-sm">
              <span className="gradient-text-accent font-semibold">Try for 7 days</span> → 60% refund if not impressed
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div key={index} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-accent text-accent-foreground px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`glass-card card-hover h-full p-8 ${
                  plan.popular ? 'ring-2 ring-accent glow-accent' : ''
                }`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${
                      plan.popular ? 'bg-gradient-accent' : 'bg-gradient-primary'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.popular ? "accent" : "hero"}
                    size="hero" 
                    className="w-full"
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.cta}
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-6">
          <div className="glass-card p-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Pause Anytime Policy</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Billing paused, unused days carry over. 31-day billing cycles. 
              For example: use 21 days, pause subscription, remaining 10 days saved for when you return.
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            No contracts. Cancel anytime. Unused time is always preserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;