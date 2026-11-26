import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alfaisal Perfumes — Custom Private Label Perfumes",
  description:
    "Alfaisal Perfumes specializes in custom private label perfume manufacturing. From concept to shelf — premium fragrances crafted for your brand.",
  keywords: [
    "private label perfumes",
    "custom perfumes",
    "perfume manufacturing",
    "white label fragrances",
    "Alfaisal Perfumes",
  ],
  openGraph: {
    title: "Alfaisal Perfumes — Custom Private Label Perfumes",
    description:
      "Premium custom private label perfume manufacturing. Your brand, our craft.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
