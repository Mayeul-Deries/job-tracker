import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as en from '../locales/en.json';
import * as fr from '../locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
  });

export const listOfLocales = ['en', 'fr'];

const localeNames: { [key: string]: string } = {
  en: 'English',
  fr: 'Français',
};

export const getFullNamesOfLocales = (locale: string) => {
  return localeNames[locale] || '';
};

export default i18n;
