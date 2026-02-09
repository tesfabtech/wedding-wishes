'use client'

import { useState } from 'react'
import { adminLogin } from './actions'

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const res = await adminLogin(formData)
    if (res?.error) setError(res.error)
  }

  return (
    <form
      action={handleSubmit}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Admin Login</h1>

        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Sign in
        </button>
      </div>
    </form>
  )
}
