import type { Metadata, Viewport } from "next";
import "./globals.css";
import Swap from "@/components/Swap";

export const metadata: Metadata = {
  title: "Gemini PRO",
  description: "Chat with Gemini Pro AI",
  manifest: "/manifest.json",
  
  openGraph: {
    type: "website",
    url: "",
    title: "Medico Ai",

    description: "Chat with Medico Ai",
    images: [
      {
        url: "/android-chrome-192x192.png",
        width: 192,
        height: 192,
        alt: "GeminiPRO Chat AI",
      },
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Medico Ai",
      },
    ],
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = {
  themeColor: "#5261ea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Swap />
        {children}
      </body>
    </html>
  );
}
