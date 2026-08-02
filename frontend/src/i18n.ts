import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from "react-i18next";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    de: {
      translation: {
        brothersGrimm: "Brüder-Grimm-Stadt",
        citizenServices: "Bürgerservice",
        cleanness: "Sauberkeit",
        dataProtection: "Datenschutz",
        hanau: "Stadt Hanau – Prototyp Mülleimer-Melder",
        home: "Startseite",
        imprint: "Impressum",
        map: "Karte",
        reports: "Meldungen"
      },
    },
    en: {
      translation: {
        brothersGrimm: "Brothers-Grimm-City",
        citizenServices: "Citizen services",
        cleanness: "Cleanness",
        dataProtection: "Data Protection",
        hanau: "City of Hanau – Prototype Garbage Bin Reporter",
        home: "Home",
        imprint: "Imprint",
        map: "Map",
        reports: "Reports"
      },
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
});

export default i18n;
