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
        homeAdministerReports: "Meldungen verwalten",
        homeAdministration: "Verwaltung",
        homeIntro: "Scannen Sie den QR-Code auf einem Mülleimer in Hanau, um diesen schnell und unkompliziert als voll oder beschädigt zu melden. Für diesen Prototyp können Sie unten einen Beispiel-Mülleimer auswählen.",
        homeLocations: "Standorte auf der Karte",
        homeOverview: "Übersicht, filtern, sortieren und Status setzen.",
        homeReportDirect: "Direkt zur Meldung für Mülleimer #1042.",
        homeReporter: "Mülleimer-Melder",
        homeReports: "Alle offenen Meldungen in Hanau auf einen Blick.",
        homeTrashBins: "Beispiel-Mülleimer (statt QR-Scan)",
        imprint: "Impressum",
        map: "Karte",
        report: "Melden",
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
        homeAdministerReports: "Administer reports",
        homeAdministration: "Administration",
        homeIntro: "Scan the QR code on a garbage bin in Hanau to quickly and easily report it as full or damaged. For this prototype, you can select an example garbage bin below.",
        homeLocations: "Locations on the map",
        homeOverview: "Overview, filter, sort and set status.",
        homeReportDirect: "Direct to the report for garbage bin #1042.",
        homeReporter: "Garbage Bin Reporter",
        homeReports: "All open reports in Hanau at a glance.",
        homeTrashBins: "Example Trash Bins (instead of QR Scan)",
        imprint: "Imprint",
        map: "Map",
        report: "Report",
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
