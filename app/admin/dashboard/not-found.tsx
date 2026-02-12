"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0b0b] overflow-hidden text-gray-200">

      {/* Subtle dark ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,185,140,0.08),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="flex justify-center mb-6 text-[#e6c78b]"
        >
          <ShieldAlert size={60} />
        </motion.div>

        <h1 className="text-5xl font-semibold mb-4">
          404 — Page Not Found
        </h1>

        <p className="text-neutral-400 mb-8">
          This admin route does not exist or may have been removed.
        </p>

        <Link
          href="/admin/dashboard"
          className="inline-block rounded-xl px-6 py-3
                     bg-[#e6c78b] text-black font-medium
                     hover:scale-105 transition"
        >
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
