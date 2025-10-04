import { useTranslation } from 'react-i18next';
import heroYaritzaCard from '@/assets/hero-yaritza-card.png';

export const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="sobre-yaritza" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Yaritza's photo and artistic frame */}
            <div className="animate-fade-in-up">
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto lg:mx-0 relative overflow-hidden rounded-2xl shadow-warm bg-gradient-warm p-8">
                  {/* Yaritza's hero card */}
                  <img 
                    src={heroYaritzaCard} 
                    alt="Yaritza Salgado Fina"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full animate-pulse-warm"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/20 rounded-full animate-pulse-warm" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-1/4 -right-8 text-4xl animate-float">🧶</div>
                <div className="absolute bottom-1/4 -left-8 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🌸</div>
              </div>
            </div>

            {/* Content */}
            <div className="animate-fade-in-up space-y-6">
              <div>
                <h2 className="text-section-title mb-4">{t('about.meetYaritza')}</h2>
                <h3 className="text-2xl font-playfair text-primary mb-6">
                  {t('about.artisanTitle')}
                </h3>
              </div>

              <div className="space-y-4 text-warm text-lg leading-relaxed">
                <p>{t('about.paragraph1')}</p>
                <p>{t('about.paragraph2')}</p>
                <p>{t('about.paragraph3')}</p>
              </div>

              {/* Key values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="card-warm">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold mb-1">{t('about.mission.title')}</h4>
                  <p className="text-sm text-warm">{t('about.mission.description')}</p>
                </div>
                <div className="card-warm">
                  <div className="text-2xl mb-2">💡</div>
                  <h4 className="font-semibold mb-1">{t('about.vision.title')}</h4>
                  <p className="text-sm text-warm">{t('about.vision.description')}</p>
                </div>
                <div className="card-warm">
                  <div className="text-2xl mb-2">❤️</div>
                  <h4 className="font-semibold mb-1">{t('about.passion.title')}</h4>
                  <p className="text-sm text-warm">{t('about.passion.description')}</p>
                </div>
                <div className="card-warm">
                  <div className="text-2xl mb-2">🌟</div>
                  <h4 className="font-semibold mb-1">{t('about.promise.title')}</h4>
                  <p className="text-sm text-warm">{t('about.promise.description')}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="border-l-4 border-primary pl-6 italic text-xl text-foreground font-playfair mt-8">
                "{t('about.quote')}"
                <footer className="text-primary text-lg mt-2 not-italic">
                  — {t('about.quoteAuthor')}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};