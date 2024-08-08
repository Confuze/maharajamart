import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F9F7F0",
        background2: "#ECD6C6",
        primary: "#1B0F0B",
        secondary: "#973543",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)", ...fontFamily.serif],
      },
      gridAutoColumns: {
        featuredDesktop: "20%",
        featuredMobile: "50%",
        categoriesDesktop: "calc(100% / 7)",
        categoriesMobile: "calc(100% / 3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
