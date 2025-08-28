import {
  Palette,
  Globe,
  Instagram,
  Layout,
  Zap,
  Smartphone,
  Package,
  Video,
  Mail,
  PenTool,
  Box,
  Bot,
  Brain,
  Camera,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import service images
import logoDesignImg from '@/assets/service-logo-design.jpg';
import socialMediaImg from '@/assets/service-social-media.jpg';
import landingPagesImg from '@/assets/service-landing-pages.jpg';
import brandingImg from '@/assets/service-branding.jpg';
import webDevelopmentImg from '@/assets/service-web-development.jpg';
import uiUxImg from '@/assets/service-ui-ux.jpg';
import threeDModelingImg from '@/assets/service-3d-modeling.jpg';
import aiAutomationImg from '@/assets/service-ai-automation.jpg';
import customAiImg from '@/assets/service-custom-ai.jpg';
import studioPhotographyImg from '@/assets/service-studio-photography.jpg';

const CapabilityMarquee = () => {
  const { t } = useTranslation();

  const capabilities = [
    {
      icon: Globe,
      label: t('capabilities.services.webDevelopment'),
      image: webDevelopmentImg,
      whatsappKey: 'webDevelopment',
    },
    {
      icon: Instagram,
      label: t('capabilities.services.socialMedia'),
      image: socialMediaImg,
      whatsappKey: 'marketing',
    },
    {
      icon: PenTool,
      label: t('capabilities.services.logoDesign'),
      image: logoDesignImg,
      whatsappKey: 'brandDesign',
    },
    {
      icon: Layout,
      label: t('capabilities.services.landingPages'),
      image: landingPagesImg,
      whatsappKey: 'landingPages',
    },
    {
      icon: Palette,
      label: t('capabilities.services.branding'),
      image: brandingImg,
      whatsappKey: 'brandStrategy',
    },
    {
      icon: Smartphone,
      label: t('capabilities.services.webDesign'),
      image: webDevelopmentImg,
      whatsappKey: 'webDesign',
    },
    {
      icon: Package,
      label: t('capabilities.services.packaging'),
      image: brandingImg,
      whatsappKey: 'packaging',
    },
    {
      icon: Video,
      label: t('capabilities.services.motionDesign'),
      image: socialMediaImg,
      whatsappKey: 'motionDesign',
    },
    {
      icon: Mail,
      label: t('capabilities.services.emailDesign'),
      image: socialMediaImg,
      whatsappKey: 'marketing',
    },
    {
      icon: Zap,
      label: t('capabilities.services.uiux'),
      image: uiUxImg,
      whatsappKey: 'uiux',
    },
    {
      icon: Box,
      label: t('capabilities.services.3dModeling'),
      image: threeDModelingImg,
      whatsappKey: '3d',
    },
    {
      icon: Bot,
      label: t('capabilities.services.aiAutomation'),
      image: aiAutomationImg,
      whatsappKey: 'aiAutomation',
    },
    {
      icon: Brain,
      label: t('capabilities.services.customAi'),
      image: customAiImg,
      whatsappKey: 'customAi',
    },
    {
      icon: Camera,
      label: t('capabilities.services.studioPhotography'),
      image: studioPhotographyImg,
      whatsappKey: 'photography',
    },
  ];

  // Triple for better visibility and seamless loop
  const triplicatedCapabilities = [
    ...capabilities,
    ...capabilities,
    ...capabilities,
  ];

  const handleServiceClick = (whatsappKey: string) => {
    const message = t(`whatsapp.${whatsappKey}`);
    const whatsappUrl = `https://wa.me/254703026422?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 overflow-hidden">
      <div className="relative">
        {/* First row - left to right */}
        <div className="flex animate-marquee gap-6 mb-6">
          {triplicatedCapabilities.slice(0, 21).map((capability, index) => {
            return (
              <div key={index} className="flex-shrink-0">
                <div
                  className="relative w-64 h-64 rounded-3xl overflow-hidden bg-black/90 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer"
                  onClick={() => { handleServiceClick(capability.whatsappKey); }}
                >
                  {/* Service Image - Takes most of the space */}
                  <div className="relative h-44 overflow-hidden rounded-t-3xl">
                    <img
                      src={capability.image}
                      alt={capability.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Service Label - Bottom section */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white text-center">
                      {capability.label}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Second row - right to left */}
        <div className="flex animate-marquee-reverse gap-6">
          {triplicatedCapabilities.slice(21).map((capability, index) => {
            return (
              <div key={index + 21} className="flex-shrink-0">
                <div
                  className="relative w-64 h-64 rounded-3xl overflow-hidden bg-black/90 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-all duration-300 group cursor-pointer"
                  onClick={() => { handleServiceClick(capability.whatsappKey); }}
                >
                  {/* Service Image - Takes most of the space */}
                  <div className="relative h-44 overflow-hidden rounded-t-3xl">
                    <img
                      src={capability.image}
                      alt={capability.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Service Label - Bottom section */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-white text-center">
                      {capability.label}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
};

export default CapabilityMarquee;
