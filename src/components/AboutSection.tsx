import { useTranslation } from 'react-i18next';
import portraitYaritza from '@/assets/yaritza-salgado.jpg';

export const AboutSection = () => {
  const { t } = useTranslation();

  return (
    <section id="sobre-yaritza" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
          <div className="mx-auto w-full max-w-[18rem] overflow-hidden rounded-2xl shadow-earth">
            <img
              src={portraitYaritza}
              alt={t('about.portraitAlt')}
              className="aspect-[3/4] w-full object-cover object-[center_12%]"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              {t('header.brandName')}
            </p>
            <h2 className="mb-6 text-left font-playfair text-3xl font-semibold text-foreground md:text-4xl">
              {t('about.meetYaritza')}
            </h2>
            <p className="mb-4 text-lg text-warm">{t('about.cardLead')}</p>
            <p className="mb-8 text-lg text-warm">{t('about.cardBody')}</p>
            <blockquote className="border-l-4 border-primary pl-6 font-playfair text-xl italic text-foreground">
              “{t('about.quote')}”
              <footer className="mt-2 text-lg not-italic text-primary">— {t('about.quoteAuthor')}</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
