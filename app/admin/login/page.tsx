'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { adminLogin } from './actions'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const res = await adminLogin(formData)
    if (res?.error) setError(res.error)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0f0f] overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D6B98C]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#E6D8B8]/10 rounded-full blur-3xl" />

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        action={handleSubmit}
        className="relative z-10 w-full max-w-md mx-6"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-white">
              Admin Login
            </h1>
            <p className="text-sm text-gray-400">
              Secure access to the wedding dashboard
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@email.com"
              className="w-full bg-white/10 border border-white/10 focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/40 text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/10 focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/40 text-white placeholder-gray-400 px-4 py-3 rounded-xl outline-none transition"
            />
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#D6B98C] hover:bg-[#C6A977] text-white font-medium py-3 rounded-xl transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Sign In
          </button>
        </div>

        {/* Footer Accent */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Wedding Admin Panel • Aman & Asegu
        </p>
      </motion.form>
    </div>
  )
}
