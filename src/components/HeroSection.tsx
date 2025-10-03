import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import heroCard from '@/assets/hero-yaritza-card.png';

export const HeroSection = () => {
  const { t } = useTranslation();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full bg-secondary/20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-20 h-20 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center z-10">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          {/* Hero Card Image */}
          <div className="mb-12">
            <img 
              src={heroCard} 
              alt="Yaritza Salgado Fina - Yari Crochet" 
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={() => scrollToSection('colecciones')}
              className="btn-hero text-lg px-8 py-4"
            >
              {t('hero.cta')}
            </Button>
            <Button
              onClick={() => scrollToSection('sobre-yaritza')}
              className="btn-outline-warm text-lg px-8 py-4"
            >
              {t('about.cta')}
            </Button>
          </div>

          {/* Key values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-warm text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-playfair text-xl font-semibold mb-2">{t('hero.uniquePieces')}</h3>
              <p className="text-warm">{t('hero.handmade')}</p>
            </div>
            <div className="card-warm text-center">
              <div className="text-3xl mb-3">🕰️</div>
              <h3 className="font-playfair text-xl font-semibold mb-2">{t('hero.ancestralTechniques')}</h3>
              <p className="text-warm">{t('hero.tradition')}</p>
            </div>
            <div className="card-warm text-center">
              <div className="text-3xl mb-3">💖</div>
              <h3 className="font-playfair text-xl font-semibold mb-2">{t('hero.everyPiece')}</h3>
              <p className="text-warm">{t('hero.uniqueStory')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};