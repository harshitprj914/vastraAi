import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import "./tw-animate.css";

export const metadata: Metadata = {
  title: "VastraAI — Your Personal AI Fashion Stylist",
  description: "Fashion tailored to your body, weather, and personality. AI-powered styling for every occasion.",
  openGraph: {
    title: "VastraAI — Your Personal AI Fashion Stylist",
    description: "Fashion tailored to your body, weather, and personality.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
