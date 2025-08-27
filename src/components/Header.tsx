import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-lg">a</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {t('header.blog')}
            </Link>
          </nav>

          {/* Navigation CTAs */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Button 
              variant="outline" 
              className="bg-gray-800/90 hover:bg-gray-700 text-white border-gray-600 rounded-xl px-6 py-2"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('header.pricing')}
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl px-6 py-2 flex items-center gap-2"
              onClick={() => window.open('https://cal.com/jeevan-singh/discovery', '_blank')}
            >
              <Phone size={16} />
              {t('header.bookCall')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;