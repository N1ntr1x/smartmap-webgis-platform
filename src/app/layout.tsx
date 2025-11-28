import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { MobileProvider } from "@/contexts/MobileContext";
import { AuthProvider } from "@/contexts/AuthContext";

import { APP_CONFIG } from "@/configs/app"

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  generator: "Next.js",
  keywords: ["nextjs", "pwa", "maps", "geojson"],
  authors: APP_CONFIG.authors,
  icons: [
    { rel: "apple-touch-icon", url: "/icons/icon-128x128.png" },
    { rel: "icon", url: "/icons/icon-128x128.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh] flex flex-col bg-gray-100 text-gray-900`}>
        <AuthProvider>
          <MobileProvider>
            <Navbar />
            <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <Sidebar />
              {children}
            </main>
          </MobileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
