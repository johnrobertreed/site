import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "John Robert Reed — Partner & CMO, Multicoin Capital",
  description:
    "John Robert (“JR”) Reed is a Partner and CMO at Multicoin Capital. Go-to-market, communications, and branding for crypto and deep tech.",
  authors: [{ name: "John Robert Reed" }],
  creator: "John Robert Reed",
  keywords: [
    "John Robert Reed",
    "JR Reed",
    "Multicoin Capital",
    "CMO",
    "go-to-market",
    "communications",
    "branding",
  ],
  openGraph: {
    title: "John Robert Reed — Partner & CMO, Multicoin Capital",
    description:
      "John Robert (“JR”) Reed is a Partner and CMO at Multicoin Capital. Go-to-market, communications, and branding for crypto and deep tech.",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary",
    title: "John Robert Reed — Partner & CMO, Multicoin Capital",
    description:
      "John Robert (“JR”) Reed is a Partner and CMO at Multicoin Capital. Go-to-market, communications, and branding for crypto and deep tech.",
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
      className={`${fraunces.variable} ${instrument.variable} ${ibm.variable}`}
    >
      <body className="min-h-screen bg-page font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
