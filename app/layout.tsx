import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
  title: {
    default: "Aman & Asegu – Together Forever",
    template: "%s · Aman & Asegu",
  },
  description:
    "Celebrate the love story of Aman & Asegu. Explore their journey, view cherished memories, and share your heartfelt wishes.",
  icons: {
    icon: "/favicon.ico",
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
        {/* Fixed Header */}
        <Header />

        {/* push content below fixed header */}
        <main className="pt-12 min-h-screen">{children}</main>

     {/* Footer */}
<footer className="relative mt-32 bg-[#0b0b0b] border-t border-gradient-to-r from-transparent via-[#C9A96A]/20 to-transparent">
  {/* subtle glow background */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(201,169,106,0.05),_transparent_70%)]"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
    <p className="text-sm text-[#8E8A83] italic mb-4">
      “Two souls, one heart — now and forever intertwined in love’s
      eternal dance.”
    </p>

    {/* decorative flourish */}
    <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-[#C9A96A]/50 to-transparent" />

    <p className="mt-4 text-xs tracking-widest text-[#C9A96A] uppercase">
      Aman & Asegu · Forever Begins
    </p>
  </div>
</footer>

      </body>
    </html>
  );
}
