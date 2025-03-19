import localFont from "next/font/local";

export const fontSerif = localFont({
  src: [
    {
      path: "../fonts/Aptos-Serif.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Aptos-Serif-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
});

export const fontSans = localFont({
  src: [
    // {
    //   path: "../fonts/Aptos.ttf",
    //   weight: "400",
    //   style: "normal",
    // },
    {
      path: "../fonts/Aptos-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});
