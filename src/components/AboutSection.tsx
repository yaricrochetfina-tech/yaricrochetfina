import { useTranslation } from 'react-i18next';

export const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="sobre-yaritza" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
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
    </section>
  );
};