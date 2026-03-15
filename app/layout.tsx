import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const uiSans = Manrope({
  variable: "--font-ui-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const uiDisplay = Manrope({
  variable: "--font-ui-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const uiMono = IBM_Plex_Mono({
  variable: "--font-ui-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Teachify",
  description: "Teachify dashboard and auth UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${uiSans.variable} ${uiDisplay.variable} ${uiMono.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
