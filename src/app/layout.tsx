import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { AppProviders } from "@/components/layout/AppProviders";
import { PortraitOverlay } from "@/components/layout/PortraitOverlay";
import { PwaGate } from "@/components/layout/PwaGate";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Children's House — Interactive Sales Kit",
  description:
    "Malaysia's longest established Montessori preschool — interactive sales kit for centre tours and open days.",
  applicationName: "TCH Sales Kit",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TCH Sales Kit",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#CD2133",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="min-h-dvh font-sans antialiased">
        <ServiceWorkerRegistration />
        <PwaGate>
          <PortraitOverlay />
          <AppProviders>{children}</AppProviders>
        </PwaGate>
      </body>
    </html>
  );
}
