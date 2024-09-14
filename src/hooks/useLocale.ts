/**
 * @fileoverview This module provides a custom hook for managing localization in a React Native app.
 * @author Your Name
 */

import { useCallback, useEffect, useState } from "react";
import { Locale, setDefaultOptions } from "date-fns";
import { enUS, fr, tr } from "date-fns/locale";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, {
  DEFAULT_LOCALE,
  SupportedLocale,
} from "@helpers/global/i18nInstance";

const localeMap: Record<SupportedLocale, Locale> = {
  en: enUS,
  fr: fr,
  tr: tr,
};

const updateI18nInstance = (locale: SupportedLocale): void => {
  i18n.locale = locale;
};

export const useLocale = () => {
  const [locale, setLocale] = useState<SupportedLocale>(() => {
    const deviceLanguage = Localization.getLocales()?.[0]
      ?.languageCode as SupportedLocale;
    return deviceLanguage in localeMap ? deviceLanguage : DEFAULT_LOCALE;
  });

  useEffect(() => {
    const loadSavedLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLocale");
        if (savedLocale && savedLocale in localeMap) {
          setLocale(savedLocale as SupportedLocale);
        }
      } catch (error) {
        console.error("Failed to load saved locale:", error);
      }
    };

    loadSavedLocale().then((r) => r);
  }, []);

  useEffect(() => {
    setDefaultOptions({ locale: localeMap[locale] });
    updateI18nInstance(locale);

    const saveLocale = async () => {
      try {
        await AsyncStorage.setItem("userLocale", locale);
      } catch (error) {
        console.error("Failed to save locale:", error);
      }
    };

    saveLocale().then((r) => r);
  }, [locale]);

  const changeLocale = useCallback((newLocale: SupportedLocale) => {
    setLocale(newLocale);
  }, []);

  return { locale, changeLocale };
};

export default useLocale;
