import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t('header.home') },
    { to: "/blog", label: t('header.blog') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-lg">a</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-4 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Navigation CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />
            <Button
              variant="outline"
              className="bg-gray-800/90 hover:bg-gray-700 text-primary-foreground border-gray-600 rounded-xl px-6 py-2"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('header.pricing')}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-primary-foreground border-0 rounded-xl px-6 py-2 flex items-center gap-2"
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