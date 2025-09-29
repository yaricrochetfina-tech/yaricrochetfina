import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import logoYariCrochetFina from '@/assets/logo-yari-crochet-fina.png';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openCart, getItemCount } = useCart();
  const itemCount = getItemCount();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-background border-2 border-primary/20">
              <img 
                src={logoYariCrochetFina} 
                alt="Yari Crochet Fina Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('colecciones')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Colecciones
            </button>
            <button
              onClick={() => scrollToSection('galeria')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Galería
            </button>
            <button
              onClick={() => scrollToSection('proceso')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Proceso
            </button>
            <button
              onClick={() => scrollToSection('sobre-yaritza')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Sobre Yaritza
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-foreground hover:text-primary transition-colors duration-300"
            >
              Contacto
            </button>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={openCart}
              className="relative p-2"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="cart-badge">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border animate-fade-in-up">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('colecciones')}
                className="text-left text-foreground hover:text-primary transition-colors duration-300"
              >
                Colecciones
              </button>
              <button
                onClick={() => scrollToSection('galeria')}
                className="text-left text-foreground hover:text-primary transition-colors duration-300"
              >
                Galería
              </button>
              <button
                onClick={() => scrollToSection('proceso')}
                className="text-left text-foreground hover:text-primary transition-colors duration-300"
              >
                Proceso
              </button>
              <button
                onClick={() => scrollToSection('sobre-yaritza')}
                className="text-left text-foreground hover:text-primary transition-colors duration-300"
              >
                Sobre Yaritza
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="text-left text-foreground hover:text-primary transition-colors duration-300"
              >
                Contacto
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};