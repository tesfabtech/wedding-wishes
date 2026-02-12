'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#121212]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          
          {/* Logo / Title */}
          <h1 className="text-lg font-serif text-[#D6B98C] tracking-wide">
            Wedding Admin
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/admin/dashboard" className="hover:text-[#D6B98C] transition cursor-pointer">
              Home
            </Link>
            <Link href="/admin/dashboard/wishes" className="hover:text-[#D6B98C] transition cursor-pointer">
              Wishes
            </Link>
            <Link href="/admin/dashboard/gallery" className="hover:text-[#D6B98C] transition cursor-pointer">
              Gallery
            </Link>

            {/* Logout */}
            <form action="/admin/login" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition cursor-pointer"
              >
                <LogOut size={16} />
                Logout
              </button>
            </form>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-[#D6B98C] transition"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-white/10 bg-[#121212]/95 backdrop-blur-xl"
            >
              <div className="flex flex-col px-6 py-4 space-y-4 text-sm">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="hover:text-[#D6B98C] transition"
                >
                  Home
                </Link>
                <Link
                  href="/admin/dashboard/wishes"
                  onClick={() => setOpen(false)}
                  className="hover:text-[#D6B98C] transition"
                >
                  Wishes
                </Link>
                <Link
                  href="/admin/dashboard/gallery"
                  onClick={() => setOpen(false)}
                  className="hover:text-[#D6B98C] transition"
                >
                  Gallery
                </Link>

                {/* Logout */}
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Push content below fixed header */}
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-12">
        {children}
      </main>
    </div>
  )
}
