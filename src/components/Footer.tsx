import { Facebook, Instagram, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export const Footer = () => {
  const {
    t
  } = useTranslation();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold">YariCrochetFina</h3>
                <p className="text-sm opacity-90">La moda audaz en Crochet</p>
              </div>
            </div>
            
            <p className="text-secondary-foreground/80 leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>

            <div className="flex space-x-4">
              <a href="https://facebook.com/yaricrochetfina" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/yaricrochetfina" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://pinterest.com/yaricrochetfina" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <span className="text-sm font-bold">P</span>
              </a>
              <a href="https://etsy.com/shop/yaricrochetfina" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <span className="text-sm font-bold">E</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          

          {/* Support & Info */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300">
                  Guía de Cuidados
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300">
                  Política de Envíos
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="yarn-divider my-12"></div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl mb-3">🧶</div>
            <h4 className="font-semibold mb-2">100% Artesanal</h4>
            <p className="text-sm text-secondary-foreground/70">
              Cada pieza tejida a mano con técnicas ancestrales
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">🌱</div>
            <h4 className="font-semibold mb-2">Materiales Naturales</h4>
            <p className="text-sm text-secondary-foreground/70">
              Fibras orgánicas y sostenibles de alta calidad
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">💖</div>
            <h4 className="font-semibold mb-2">Satisfacción Garantizada</h4>
            <p className="text-sm text-secondary-foreground/70">
              Compromiso con la excelencia en cada creación
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-foreground/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-secondary-foreground/70">
              <span>© 2024 YariCrochetFina.</span>
              <span>{t('footer.rights')}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-secondary-foreground/70">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 text-red-400 fill-red-400" />
              <span>por Yaritza Salgado Fina</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};