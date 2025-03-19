import { defineRouting } from "next-intl/routing";
// import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "pl"],

  // Used when no locale matches
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type localeType = "pl" | "en";
