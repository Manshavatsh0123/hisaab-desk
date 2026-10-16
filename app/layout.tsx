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
  title: "HisaabSaathi",
  description: "HisaabSaathi - Digital Collection & Record Book",
  generator: "HisaabSaathi",

  icons: {
    icon: "/Logo1.png",
    shortcut: "/Logo1.png",
    apple: "/Logo1.png",
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