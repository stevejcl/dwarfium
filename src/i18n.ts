import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/locales/en";
import esTranslation from "@/locales/es";
import frTranslation from "@/locales/fr";
import deTranslation from "@/locales/de";
import nlTranslation from "@/locales/nl";
import itTranslation from "@/locales/it";

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: deTranslation },
    en: { translation: enTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
    nl: { translation: nlTranslation },
    it: { translation: itTranslation },
  },
  fallbackLng: "en",
  lng: "en", // Default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
