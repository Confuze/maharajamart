import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
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
        categoriesDesktop: "calc(100% / 5)",
        categoriesMobile: "calc(100% / 2)",
        paymentMethodsDesktop: "calc(100% / 6)",
        paymentMethodsMobile: "calc(100% / 3)",
      },
      gridColumn: {
        middle: "2 / 4",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
