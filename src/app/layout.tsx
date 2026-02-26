import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { Footer } from "@/components/stranger-things/Footer";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} ${cormorant.variable} antialiased selection:bg-red-900 selection:text-white`}>
        <SmoothScrollProvider>
          {/* Universal Hacknovate Logo for Navigation */}
          <NavigationLogo />

          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            {/* Universal Footer */}
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
