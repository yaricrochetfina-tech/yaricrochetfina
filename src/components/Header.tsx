import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useSectionNavigation } from '@/hooks/useSectionNavigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { BrandMark } from '@/components/BrandMark';

const NAV_ITEMS = [
  { type: 'route', to: '/colecciones', labelKey: 'header.products' },
  { type: 'section', id: 'sobre-yaritza', labelKey: 'header.about' },
  { type: 'section', id: 'contacto', labelKey: 'header.contact' },
] as const;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const openCart = useCart((state) => state.openCart);
  const itemCount = useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const goToSection = useSectionNavigation();

  const handleNavigate = (sectionId: string) => {
    goToSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t('common.unexpectedError'));
      return;
    }
    toast.success(t('header.loggedOut'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-background/55 backdrop-blur-md">
      <div className="container mx-auto px-4 py-2.5 md:py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={handleLogoClick}
            aria-label={t('header.home')}
            className="flex items-center gap-3"
          >
            <BrandMark alt={t('header.logoAlt')} className="h-11 w-11 md:h-14 md:w-14" />
            <span className="font-playfair text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
              {t('header.brandName')}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8" aria-label={t('header.mainNav')}>
            {NAV_ITEMS.map((item) =>
              item.type === 'route' ? (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-foreground hover:text-primary transition-colors duration-300"
                >
                  {t(item.labelKey)}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className="text-foreground hover:text-primary transition-colors duration-300"
                >
                  {t(item.labelKey)}
                </button>
              )
            )}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <LanguageSelector />

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2"
                aria-label={t('header.logout')}
                title={t('header.logout')}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label={t('header.login')}
                title={t('header.login')}
              >
                <Link to="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={openCart}
              className="relative p-2"
              aria-label={`${t('header.openCart')}${itemCount > 0 ? ` (${itemCount})` : ''}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            className="md:hidden mt-3 py-4 border-t border-border animate-fade-in-up"
            aria-label={t('header.mainNav')}
          >
            <div className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item) =>
                item.type === 'route' ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-left text-foreground hover:text-primary transition-colors duration-300 py-1"
                  >
                    {t(item.labelKey)}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    className="text-left text-foreground hover:text-primary transition-colors duration-300 py-1"
                  >
                    {t(item.labelKey)}
                  </button>
                )
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
