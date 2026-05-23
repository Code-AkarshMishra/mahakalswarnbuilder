import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mahakalswarnbuilder.in"),

  title: {

    default: "Mahakal Swarn Builders | Real Estate Builder ",
    template: "%s | Mahakal Swarn Builder",
  },

  description:
    "Founded by Swarn Kumar Tripathi. Mahakal Swarn Builder is North India's fastest-growing real estate startup delivering premium, Vastu-compliant residential and commercial properties at affordable prices.",

  // 🔴 YAHAN FAVICON ADD KIYA GAYA HAI 
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  keywords: [
    "Mahakal Swarn Builder",
    "M S Builder",
    "Swarn Builder",
    "Swarn Tripathi",
    "Swarn Kumar Tripathi",
    "Top builders in Lucknow",
    "Best construction company in Noida",
    "Real estate developers in Delhi NCR",
    "Luxury villa builders in Lucknow",
    "Vastu compliant homes",
    "Affordable luxury real estate",
    "Premium residential construction",
    "Commercial space builders",
    "RERA registered builders Lucknow",
    "Turnkey construction contractors",
    "Best property developers in Uttar Pradesh",
    "Mahakal Swarn Real Estate",
  ],

  authors: [{ name: "Swarn Kumar Tripathi" }],

  creator: "Mahakal Swarn Builder",
  publisher: "Mahakal Swarn Builder",

  alternates: {
    canonical: "https://www.mahakalswarnbuilder.in",
  },

  openGraph: {
    // 🔴 WhatsApp/Facebook par link share karne par ye title dikhega
    title: "Mahakal Swarn Builders | Premium Construction",
    description:
      "Delivering premium luxury residencies and commercial projects across Lucknow, Noida, and Delhi NCR.",

    url: "https://www.mahakalswarnbuilder.in",

    siteName: "Mahakal Swarn Builder",

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mahakal Swarn Builders",
    description:
      "Premium real estate and luxury construction company.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${serif.variable} ${sans.variable} font-sans bg-heritage-dark text-navy-deep overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}