import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';

export const SUPPORTED_LANGUAGES = ['es', 'fr', 'en'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Normaliza cualquier código ("es-MX", "fr-CA"...) a uno de los idiomas soportados. */
export const normalizeLanguage = (lng?: string): AppLanguage => {
  const base = (lng || '').split('-')[0].toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base) ? (base as AppLanguage) : 'es';
};

const applyDocumentLanguage = (lng: string) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = normalizeLanguage(lng);
  document.title = i18n.t('meta.title');
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', i18n.t('meta.description'));
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      fr: { translation: fr },
      en: { translation: en },
    },
    supportedLngs: [...SUPPORTED_LANGUAGES],
    // Español por defecto. Si el navegador del visitante está en francés o inglés,
    // el detector elige ese idioma automáticamente (o el que haya guardado antes).
    fallbackLng: 'es',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })
  .then(() => applyDocumentLanguage(i18n.language));

i18n.on('languageChanged', applyDocumentLanguage);

export default i18n;
