import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Main Headlines */}
        <div className="space-y-8 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="text-primary-foreground">{t('hero.title')}</span>
            <br />
            <span className="text-primary-foreground">{t('hero.subtitle')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Button 
            variant="outline"
            size="lg" 
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-lg px-8 py-4 text-lg min-w-[150px]"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('hero.pricing')}
          </Button>
          
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-8 py-4 text-lg min-w-[150px] group"
            onClick={() => window.open('https://cal.com/jeevan-singh/discovery', '_blank')}
          >
            {t('hero.letsTalk')}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;