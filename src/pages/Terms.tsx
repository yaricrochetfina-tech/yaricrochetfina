import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import { CONTACT_EMAIL } from '@/lib/store';

const SECTION_IDS = ['1', '2', '3', '4', '5'] as const;

const Terms = () => {
  const { t } = useTranslation();

  return (
    <>
      <main className="pt-28 pb-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          <header className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{t('terms.subtitle')}</p>
            <h1 className="text-section-title !mb-0">{t('terms.title')}</h1>
          </header>

          {SECTION_IDS.map((id) => (
            <section key={id} id={`seccion-${id}`} className="space-y-2 scroll-mt-28">
              <h2 className="font-playfair text-2xl font-semibold">
                {id}. {t(`terms.sections.${id}.title`)}
              </h2>
              <p className="text-warm leading-relaxed">{t(`terms.sections.${id}.body`)}</p>
              {id === '3' && (
                <p className="text-sm">
                  <Link to="/envios" className="text-primary underline underline-offset-4 hover:opacity-80">
                    {t('terms.shippingLink')}
                  </Link>
                </p>
              )}
            </section>
          ))}

          <p className="text-sm text-muted-foreground">
            {t('terms.contact', { email: CONTACT_EMAIL })}
          </p>

          <Button asChild variant="outline">
            <Link to="/">← {t('terms.back')}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Terms;
