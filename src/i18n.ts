import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/locales/en.json";
import esTranslation from "@/locales/es.json";
import frTranslation from "@/locales/fr.json";
import deTranslation from "@/locales/de.json";
import nlTranslation from "@/locales/nl.json";
import itTranslation from "@/locales/it.json";
import plTranslation from "@/locales/pl.json";
import ptTranslation from "@/locales/pt.json";
import zhCNTranslation from "@/locales/zh_CN.json";

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: deTranslation },
    en: { translation: enTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
    nl: { translation: nlTranslation },
    it: { translation: itTranslation },
    pl: { translation: plTranslation },
    pt: { translation: ptTranslation },
    zhCN: { translation: zhCNTranslation },
  },
  fallbackLng: "en",
  lng: "en", // Default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
