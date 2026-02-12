"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0b0b]/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        {/* Logo */}
<Link
  href="/"
  className="flex items-center gap-3 group"
>
  <Image
  src="/logo.png"
  alt="Aman & Asegu Logo"
  width={40}
  height={40}
  className="object-contain drop-shadow-[0_0_6px_rgba(201,169,106,0.4)] cursor-pointer"
/>


  <span className="text-xs tracking-[0.35em] uppercase text-[#C9A96A] group-hover:text-[#E6D8B8] transition">
    Aman & Asegu
  </span>
</Link>


        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-[#B9B5AE]">
          <Link href="/" className="hover:text-[#E6D8B8] transition cursor-pointer">
            Home
          </Link>
          <Link href="/gallery" className="hover:text-[#E6D8B8] transition cursor-pointer">
            Gallery
          </Link>
          <Link href="/wishes" className="hover:text-[#E6D8B8] transition cursor-pointer">
            Wishes
          </Link>
          <Link
            href="/submit-wish"
            className="ml-4 px-5 py-2 rounded-xl bg-[#C9A96A] text-[#0b0b0b] hover:bg-[#E6D8B8] transition cursor-pointer"
          >
            Submit a Wish
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#E6D8B8]"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0b0b0b] border-t border-white/5"
          >
            <nav className="flex flex-col px-6 py-6 gap-5 text-sm text-[#B9B5AE]">
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/gallery" onClick={() => setOpen(false)}>
                Gallery
              </Link>
              <Link href="/wishes" onClick={() => setOpen(false)}>
                Wishes
              </Link>
              <Link
                href="/submit-wish"
                onClick={() => setOpen(false)}
                className="mt-2 inline-block text-center px-5 py-2 rounded-xl bg-[#C9A96A] text-[#0b0b0b]"
              >
                Submit a Wish
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
