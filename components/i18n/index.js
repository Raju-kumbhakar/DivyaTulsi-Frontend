import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./languages/en.json";
import hi from "./languages/hi.json";

const LANG_KEY = "APP_LANGUAGE";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

export const changeLanguage = async (lang) => {
  await AsyncStorage.setItem(LANG_KEY, lang);
  i18n.changeLanguage(lang);
};

export const initLanguage = async () => {
  const savedLang = await AsyncStorage.getItem(LANG_KEY);

  const fallback = { languageTag: "en" };
  const { languageTag } =
    savedLang
      ? { languageTag: savedLang }
      : RNLocalize.findBestAvailableLanguage(Object.keys(resources)) ||
        fallback;

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: languageTag,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
};

export default i18n;
