import { getRequestConfig } from "next-intl/server";
import { localeType, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  // if (!locales.includes(locale as "en" | "pl")) notFound();

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as localeType)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
