import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales } from "./config";

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(pl|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
