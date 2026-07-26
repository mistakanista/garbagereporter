import i18n from "i18next";
import { register } from "module";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: {
        brothersGrimm: "Brüder-Grimm-Stadt",
        home: "Startseite",
        map: "Karte",
        reports: "Meldungen"
      },
    },
    en: {
      translation: {
        brothersGrimm: "Brothers-Grimm-City",
        home: "Home",
        map: "Map",
        reports: "Reports"
      },
    },
  },
  lng: "de", // default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
