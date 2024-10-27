import { Judson, Merriweather_Sans } from "next/font/google";

export const fontSerif = Judson({
  subsets: ["latin-ext"],
  variable: "--font-serif",
  weight: ["400", "700"],
});

export const fontSans = Merriweather_Sans({
  subsets: ["latin-ext"],
  variable: "--font-sans",
  weight: ["400", "600"],
});
