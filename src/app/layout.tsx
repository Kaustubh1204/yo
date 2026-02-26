import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { NavigationLogo } from "@/components/stranger-things/NavigationLogo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cormorant"
});

export const metadata: Metadata = {
  title: "HACKNOVATE 7.0 - The Finale",
  description: "HACKNOVATE 7.0 — Experience the epic finale.",
  verification: {
    google: "GHtkFMWX2dbjiXRQv8RpqQTKA4cpQpv5J5HSL4FNFLs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased selection:bg-red-900 selection:text-white`}
      >
        <SmoothScrollProvider>
          <NavigationLogo />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
