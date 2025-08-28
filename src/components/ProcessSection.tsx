import { CheckCircle, MessageSquare, RotateCcw } from 'lucide-react';
import subscribeImage from '@/assets/process-subscribe.jpg';
import requestImage from '@/assets/process-request.jpg';
import approveImage from '@/assets/process-approve.jpg';
import { useTranslation } from 'react-i18next';

const ProcessSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: CheckCircle,
      title: t('process.steps.subscribe.title'),
      description: t('process.steps.subscribe.description'),
      image: subscribeImage,
      features: t('process.steps.subscribe.features', { returnObjects: true }),
    },
    {
      number: '02',
      icon: MessageSquare,
      title: t('process.steps.request.title'),
      description: t('process.steps.request.description'),
      image: requestImage,
      features: t('process.steps.request.features', { returnObjects: true }),
    },
    {
      number: '03',
      icon: RotateCcw,
      title: t('process.steps.approve.title'),
      description: t('process.steps.approve.description'),
      image: approveImage,
      features: t('process.steps.approve.features', { returnObjects: true }),
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {t('process.title')}{' '}
            <span className="gradient-text">{t('process.subtitle')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('process.description')}
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="glass-card card-hover text-center space-y-6 h-full">
                  {/* Step Number */}
                  <div className="text-6xl font-black text-primary/20 mb-4">
                    {step.number}
                  </div>

                  {/* Process Image */}
                  <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

                    {/* Icon overlay */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center glow-primary">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(step.features as string[]).map(
                        (feature: string, featureIndex: number) => (
                          <span
                            key={featureIndex}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {feature}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-12 h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-full -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
