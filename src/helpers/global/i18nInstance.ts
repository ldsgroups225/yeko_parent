/**
 * @fileoverview This module creates and exports the i18n instance.
 * @author Your Name
 */

import { I18n } from "i18n-js";
import { EnResource, FrResource, TrResource } from "@src/localization/index";

export const DEFAULT_LOCALE = "fr" as const;
export type SupportedLocale = "en" | "fr" | "tr";

type LocalizationResources = {
  en: typeof EnResource;
  fr: typeof FrResource;
  tr: typeof TrResource;
};

const i18n = new I18n(
  {
    en: EnResource,
    fr: FrResource,
    tr: TrResource,
  } as LocalizationResources,
  {
    locale: DEFAULT_LOCALE,
    enableFallback: true,
    defaultLocale: DEFAULT_LOCALE,
  }
);

export default i18n;
