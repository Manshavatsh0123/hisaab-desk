import type { Metadata } from "next";
import React from "react";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BharosaSaathi",
    template: "%s | BharosaSaathi",
  },

  description:
    "BharosaSaathi - Digital Collection & Record Book. Manage customers, collections, payments, and account records securely in one place.",

  applicationName: "BharosaSaathi",

  generator: "Next.js",

  icons: {
    icon: "/BharosaSaathi_Logo.png",
    shortcut: "/BharosaSaathi_Logo.png",
    apple: "/BharosaSaathi_Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <StoreProvider>{children}</StoreProvider>

        <Analytics />
      </body>
    </html>
  );
}