"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0f0f] overflow-hidden text-white">

      {/* Soft gold glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(230,199,139,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(230,199,139,0.1),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        <motion.h1
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-7xl sm:text-8xl font-serif bg-linear-to-r from-[#e6c78b] via-white to-[#e6c78b] bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <p className="mt-6 text-neutral-400 max-w-md mx-auto">
          Oops… this love story page seems to have wandered off.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 rounded-full px-6 py-3
                     bg-[#e6c78b] text-black font-medium
                     hover:scale-105 transition transform"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
