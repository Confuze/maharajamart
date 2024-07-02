import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backround: "#F9F7F0",
        background2: "#ECD6C6",
        primary: "#1B0F0B",
        secondary: "#973543",
      }
    },
  },
  plugins: [],
};
export default config;
