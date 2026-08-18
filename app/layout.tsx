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
  weight: ["400", "500", "600"],
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

const themeBoot = '(function(){try{var stored=localStorage.getItem("theme");var theme=stored||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme="light";}})();';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrument.variable} ${ibm.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
