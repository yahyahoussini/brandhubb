import { Instagram, Music } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  
  const navigation = [
    { name: t('footer.about'), href: "#about", onClick: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: t('footer.services'), href: "#services", onClick: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: t('footer.testimonials'), href: "#testimonials", onClick: () => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: t('footer.bookCall'), href: "#", onClick: () => window.open('https://cal.com/jeevan-singh/discovery', '_blank') },
  ];

  const legal = [
    { name: t('footer.terms'), href: "/terms" },
    { name: t('footer.privacy'), href: "/privacy" },
  ];

  const social = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "TikTok", icon: Music, href: "https://tiktok.com" },
  ];

  return (
    <footer className="border-t border-white/10 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">B</span>
              </div>
              <span className="text-2xl font-bold gradient-text">BrandHUB</span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Design subscription to scale your business. 
              Professional creative services with unlimited revisions and fast turnaround times.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">{t('footer.contact')}</p>
              <p className="text-muted-foreground">
                <a href="mailto:info@brandhub.co.ke" className="animated-underline hover:text-accent">
                  info@brandhub.co.ke
                </a>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h3 className="font-semibold">Navigation</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={item.onClick}
                    className="text-muted-foreground hover:text-foreground animated-underline transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-6">
            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-3">
                {legal.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground animated-underline transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                {social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors group"
                    >
                      <Icon className="w-5 h-5 group-hover:text-accent transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;