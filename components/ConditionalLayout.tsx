"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  const hideLayout = isAdminRoute || isLoginRoute;

  return (
    <>
      {!hideLayout && <Header />}

      <main className={!hideLayout ? "pt-12 min-h-screen" : "min-h-screen"}>
        {children}
      </main>

      {!hideLayout && (
        <footer className="relative mt-32 bg-[#0b0b0b] border-t border-[#C9A96A]/20 overflow-hidden">
  {/* Subtle radial glow */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(201,169,106,0.08),transparent_70%)]" />

  <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 text-center flex flex-col items-center">

    {/* Bible Verse */}
    <p className="max-w-3xl text-sm  text-[#8E8A83] italic mb-4 md:text-base leading-relaxed">
      “So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.”
    </p>

    <p className="mt-3 text-xs tracking-[0.25em] text-[#C9A96A] uppercase">
      Mark 10:8–9
    </p>

    {/* Elegant Divider */}
    <div className="my-2 h-px w-32 bg-linear-to-r from-transparent via-[#C9A96A]/60 to-transparent" />

    {/* Logo */}
    <div className="flex justify-center">
      <Image
        src="/logo.png"
        alt="Aman & Asegu Logo"
        width={110}
        height={110}
        className="object-contain drop-shadow-[0_0_12px_rgba(201,169,106,0.6)] transition duration-500 hover:scale-105"
      />
    </div>

    {/* Tagline */}
    <p className="mt-6 text-xs tracking-widest text-[#C9A96A]/80 uppercase">
      Aman & Asegu · Forever Begins
    </p>

  </div>
</footer>

      )}
    </>
  );
}
