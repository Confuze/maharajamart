import { cn } from "@/src/lib/utils";
import React from "react";
import { fontSans, fontSerif } from "../fonts";
import "@/src/styles/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s - Maharaja Mart administration panel",
    default: "Maharaja Mart administration panel",
  },
  description: "Administration panel for the Maharaja Mart Shop",
};

export default function AdminLayoutGlobal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="min-h-full relative scroll-smooth" lang="en">
      <body
        className={cn(
          "min-h-screen h-full text-primary bg-repeat bg-backround font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
