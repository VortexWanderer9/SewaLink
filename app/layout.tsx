import type { Metadata, Viewport } from "next";
import { Sora, Inter, IBM_Plex_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { StampFilterDefs } from "@/components/VerifiedStamp";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["500", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-plex-mono", weight: ["400", "500"] });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-noto-devanagari" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sewalinknepal.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "SewaLink Nepal — Trusted Local Services, One Tap Away",
    template: "%s · SewaLink Nepal",
  },
  description:
    "Book verified electricians, plumbers, carpenters, AC technicians, tutors and more across Kathmandu Valley, Pokhara and beyond. Background-checked professionals with ratings, live tracking and secure payments.",
  keywords: [
    "Nepal services",
    "Kathmandu electrician",
    "plumber near me",
    "verified workers Nepal",
    "home services Kathmandu",
    "AC repair Pokhara",
    "SewaLink",
    "tradesman Nepal",
    "handyman Kathmandu",
  ],
  authors: [{ name: "SewaLink Nepal", url: APP_URL }],
  creator: "SewaLink Nepal",
  publisher: "SewaLink Nepal",
  category: "Home Services Marketplace",
  applicationName: "SewaLink Nepal",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "SewaLink Nepal — Trusted Local Services, One Tap Away",
    description:
      "Book verified electricians, plumbers, carpenters, tutors and more. Background-checked, rated and ready today.",
    siteName: "SewaLink Nepal",
    locale: "en_US",
    alternateLocale: ["ne_NP"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SewaLink Nepal — Trusted Local Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SewaLink Nepal — Trusted Local Services, One Tap Away",
    description:
      "Book verified electricians, plumbers, carpenters, tutors and more across Nepal.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF9F4" },
    { media: "(prefers-color-scheme: dark)", color: "#1A2440" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${plexMono.variable} ${notoDevanagari.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-indigo-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper-50"
        >
          Skip to content
        </a>
        <StampFilterDefs />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
