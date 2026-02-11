'use client'

import { useState } from 'react'
import { supabaseClient } from '@/lib/supabaseClient'

export default function SubmitWishPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const MAX_SIZE = 300 * 1024 * 1024 // 300MB

  async function uploadVideo(file: File): Promise<string> {
    if (file.size > MAX_SIZE) {
      throw new Error('Video must be under 300MB')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    )

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await res.json()

    if (!data.secure_url) {
      throw new Error('Video upload failed')
    }

    return data.secure_url
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (!name || !message || !videoFile) {
        throw new Error('All fields are required')
      }

      if (message.length > 500) {
        throw new Error('Message too long')
      }

      const videoUrl = await uploadVideo(videoFile)

      const { error } = await supabaseClient.from('wishes').insert({
        name,
        message,
        video_url: videoUrl,
        is_approved: false,
        is_featured: false,
      })

      if (error) throw error

      setSuccess(true)
      setName('')
      setMessage('')
      setVideoFile(null)
    } catch (err: any) {
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-20 text-gray-200">
      {/* ambient glow / soft radial light */}
      <div className="pointer-events-none absolute inset-0
                      bg-[radial-gradient(circle_at_top,_rgba(214,185,140,0.08),_transparent_55%)]" />

      <div className="mx-auto max-w-xl text-center">
        <h1 className="mb-4 text-4xl font-serif text-[#e6c47a]">
          Share Your Wish
        </h1>

        <p className="mb-10 text-sm text-gray-400">
          Leave a heartfelt message or record a short video (30–60 seconds)
        </p>

        {success ? (
          <div className="rounded-xl bg-[#161616] p-6 shadow-lg">
            <p className="text-lg font-medium text-green-400">
              Thank you! Your wish has been submitted 💛
            </p>
            <p className="mt-2 text-sm text-gray-400">
              It will appear after approval.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-[#161616] p-8 shadow-xl"
          >
            {/* Name */}
            <div className="mb-5 text-left">
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e6c47a]"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-5 text-left">
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={4}
                className="w-full rounded-md border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e6c47a]"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {message.length}/500
              </p>
            </div>

            {/* Video */}
            <div className="mb-8 py-5 text-center rounded-md border border-[#2a2a2a] space-y-4">
              <label className="mb-1 block text-sm font-medium text-gray-300">
                Video Message
              </label>
              <input
                type="file"
                accept="video/mp4,video/mov,video/webm"
                onChange={(e) =>
                  setVideoFile(e.target.files?.[0] || null)
                }
                required
                className="text-sm text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-[#e6c47a] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1a1a1a] hover:file:bg-[#c9a24d]   rounded-md border border-[#2a2a2a]   cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#e6c47a]"
              />
              <p className="mt-1 text-xs text-gray-500">
                Max 300MB • 30–60 seconds
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-linear-to-r from-[#e6c47a] to-[#c9a24d] py-3 font-medium text-[#1a1a1a] hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Your Wish'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
