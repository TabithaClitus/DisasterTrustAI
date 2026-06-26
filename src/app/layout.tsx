import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DisasterTrust AI — Community Disaster Response Platform",
  description:
    "A community-powered disaster response platform with real-time reporting, AI-based prioritization, confidence scoring, and volunteer coordination. When every second counts, trust matters.",
  keywords: [
    "disaster response",
    "emergency reporting",
    "flood relief",
    "volunteer coordination",
    "disaster management",
    "AI emergency",
    "trust score",
  ],
  openGraph: {
    title: "DisasterTrust AI — When Every Second Counts, Trust Matters",
    description:
      "Real-time disaster reporting with AI confidence scoring. Verified information for faster, smarter relief.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
