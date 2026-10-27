import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';
import {
  DELIVERY_MAX_DAYS,
  DELIVERY_MIN_DAYS,
  SHIPPING_COUNTRIES,
  formatPrice,
  getCountryName,
} from '@/lib/store';

const ShippingPolicy = () => {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  const rows = SHIPPING_COUNTRIES.map((c) => ({ ...c, name: getCountryName(c.code, language) })).sort(
    (a, b) => a.name.localeCompare(b.name, language)
  );

  return (
    <>
      <main className="pt-28 pb-16 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          <header className="space-y-3">
            <h1 className="text-section-title !mb-0">{t('shippingPolicy.title')}</h1>
            <p className="text-warm text-lg">{t('shippingPolicy.intro')}</p>
          </header>

          <section className="space-y-4">
            <h2 className="font-playfair text-2xl font-semibold">{t('shippingPolicy.ratesTitle')}</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">{t('shippingPolicy.country')}</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-right">{t('shippingPolicy.cost')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.code} className="border-t border-border">
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatPrice(row.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">{t('shippingPolicy.ratesNote')}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-playfair text-2xl font-semibold">{t('shippingPolicy.timesTitle')}</h2>
            <p className="text-warm">
              {t('shippingPolicy.times', { min: DELIVERY_MIN_DAYS, max: DELIVERY_MAX_DAYS })}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-playfair text-2xl font-semibold">{t('shippingPolicy.insuranceTitle')}</h2>
            <p className="text-warm">{t('shippingPolicy.insurance')}</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-playfair text-2xl font-semibold">{t('shippingPolicy.otherTitle')}</h2>
            <p className="text-warm">{t('shippingPolicy.other')}</p>
          </section>

          <Button asChild variant="outline">
            <Link to="/">← {t('shippingPolicy.backToStore')}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShippingPolicy;
