import { Link } from 'react-router-dom';
import { Facebook, Instagram, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSectionNavigation } from '@/hooks/useSectionNavigation';
import { CONTACT_EMAIL } from '@/lib/store';
import { BrandMark } from '@/components/BrandMark';

const SOCIAL_LINKS = [
  { key: 'facebook', href: 'https://facebook.com/yaricrochetfina', icon: <Facebook className="h-5 w-5" aria-hidden="true" /> },
  { key: 'instagram', href: 'https://instagram.com/yaricrochetfina', icon: <Instagram className="h-5 w-5" aria-hidden="true" /> },
  { key: 'pinterest', href: 'https://pinterest.com/yaricrochetfina', icon: <span className="text-sm font-bold" aria-hidden="true">P</span> },
  { key: 'etsy', href: 'https://etsy.com/shop/yaricrochetfina', icon: <span className="text-sm font-bold" aria-hidden="true">E</span> },
] as const;

export const Footer = () => {
  const { t } = useTranslation();
  const goToSection = useSectionNavigation();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <BrandMark alt="" className="h-12 w-12" />
              <div>
                <h3 className="font-playfair text-2xl font-bold">{t('header.brandName')}</h3>
                <p className="text-sm opacity-90">{t('footer.tagline')}</p>
              </div>
            </div>

            <p className="text-secondary-foreground/80 leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>

            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('footer.followOn', { network: t(`footer.social.${social.key}`) })}
                  className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div id="contacto" className="md:col-span-2 md:pl-12">
            <h4 className="font-semibold mb-4 text-lg">{t('footer.support')}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/envios"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  {t('footer.shippingPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terminos"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSection('contacto')}
                  className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  {t('footer.contactUs')}
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-secondary-foreground/80 hover:text-primary transition-colors duration-300 break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="yarn-divider my-12"></div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl mb-3" aria-hidden="true">🧶</div>
            <h4 className="font-semibold mb-2">{t('footer.handmade')}</h4>
            <p className="text-sm text-secondary-foreground/70">{t('footer.handmadeDescription')}</p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-3" aria-hidden="true">🌱</div>
            <h4 className="font-semibold mb-2">{t('footer.natural')}</h4>
            <p className="text-sm text-secondary-foreground/70">{t('footer.naturalDescription')}</p>
          </div>

          <div className="text-center">
            <div className="text-3xl mb-3" aria-hidden="true">💖</div>
            <h4 className="font-semibold mb-2">{t('footer.satisfaction')}</h4>
            <p className="text-sm text-secondary-foreground/70">{t('footer.satisfactionDescription')}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-secondary-foreground/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <div className="text-sm text-secondary-foreground/70">
              © {new Date().getFullYear()} {t('header.brandName')}. {t('footer.rights')}
            </div>

            <div className="flex items-center space-x-2 text-sm text-secondary-foreground/70">
              <span>{t('footer.madeWith')}</span>
              <Heart className="h-4 w-4 text-red-400 fill-red-400" aria-hidden="true" />
              <span>{t('footer.by')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
