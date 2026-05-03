import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL('https://mahakalswarnbuilder.vercel.app/'),
  title: "Mahakal Swarn Builder | Real Estate Builder ",
  description: "Founded by Swarn Kumar Tripathi. Mahakal Swarn Builder is North India's fastest-growing real estate startup delivering premium, Vastu-compliant residential and commercial properties at affordable prices.",
  keywords: [
    "Mahakal Swarn Builder", "MS Builder", "Swarn Builder", "Swarn Tripathi", "Swarn Kumar Tripathi",
    "Top builders in Lucknow", "Best construction company in Noida", "Real estate developers in Delhi NCR",
    "Luxury villa builders in Lucknow", "Vastu compliant homes", "Affordable luxury real estate",
    "Premium residential construction", "Commercial space builders", "RERA registered builders Lucknow",
    "Turnkey construction contractors", "Best property developers in Uttar Pradesh", "Mahakal Swarn Real Estate"
  ],
  authors: [{ name: "Swarn Kumar Tripathi" }],
  creator: "Mahakal Swarn Builder",
  publisher: "Mahakal Swarn Builder",
  openGraph: {
    title: "Mahakal Swarn Builder | Real Estate Builder ",
    description: "Delivering 3D-precision luxury residencies across Lucknow, Delhi, and Noida.",
    url: 'https://mahakalswarnbuilder.vercel.app/',
    siteName: 'Mahakal Swarn Builder',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} font-sans bg-heritage-dark text-navy-deep overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}