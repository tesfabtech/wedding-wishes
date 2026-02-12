import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "Aman & Asegu Wedding | Share Your Wishes",
    template: "%s · Aman & Asegu Wedding",
  },

  description:
    "Join Aman & Asegu in celebrating their wedding. Explore their love story, view memorable moments, and leave your heartfelt wedding wishes online.",

  keywords: [
    "Aman and Asegu",
    "Aman and Asegu wedding",
    "wedding wishes",
    "online wedding guestbook",
    "wedding celebration",
    "digital wedding card",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Aman & Asegu Wedding | Share Your Wishes",
    description:
      "Celebrate Aman & Asegu’s special day. View their journey and leave your heartfelt wedding message.",
    url: "https://yourdomain.com",
    siteName: "Aman & Asegu Wedding",
    images: [
      {
        url: "/og-image.png", // create this
        width: 1200,
        height: 630,
        alt: "Aman & Asegu Wedding",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aman & Asegu Wedding | Share Your Wishes",
    description:
      "Leave your heartfelt wedding wishes for Aman & Asegu and celebrate their special day.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.png",
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
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-[#0b0b0b]
          text-[#EDEAE4]
        `}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
