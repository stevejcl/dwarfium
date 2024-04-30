import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en';
import esTranslation from './locales/es';
import frTranslation from './locales/fr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation }
    },
    lng: 'en', // Default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;