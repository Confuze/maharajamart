import { LocalePrefix } from "next-intl/routing";

export const defaultLocale = "pl" as const;
export const locales = ["pl", "en"] as const;

export const localePrefix: LocalePrefix<typeof locales> = "as-needed";
