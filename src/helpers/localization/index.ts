/**
 * @fileoverview This module provides a translate function that uses the i18n instance for translations.
 * @author Ali Burhan Keskin <alikeskin@milvasoft.com>
 */

import { Scope, TranslateOptions } from "i18n-js";
import i18n from "@helpers/global/i18nInstance";

/**
 * Translates the given key into the current language.
 *
 * @param key - The translation key.
 * @param options - Optional translation options.
 * @returns The translated text.
 */
const translate = (key: Scope, options?: TranslateOptions): string => {
  return i18n.t(key, options);
};

export default translate;
