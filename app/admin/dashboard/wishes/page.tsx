'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Wish = {
  id: string
  name: string
  message: string
  video_url: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

export default function AdminWishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchWishes() {
    setLoading(true)

    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setWishes(data)
    }

    setLoading(false)
  }

  async function toggleApprove(wish: Wish) {
    await supabase
      .from('wishes')
      .update({ is_approved: !wish.is_approved })
      .eq('id', wish.id)

    fetchWishes()
  }

  async function toggleFeature(wish: Wish) {
    await supabase
      .from('wishes')
      .update({ is_featured: !wish.is_featured })
      .eq('id', wish.id)

    fetchWishes()
  }

  async function deleteWish(id: string) {
    const confirmDelete = confirm('Delete this wish permanently?')
    if (!confirmDelete) return

    await supabase.from('wishes').delete().eq('id', id)
    fetchWishes()
  }

  useEffect(() => {
    fetchWishes()
  }, [])

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Manage Wishes</h2>

      {loading ? (
        <p className="text-gray-400">Loading wishes...</p>
      ) : wishes.length === 0 ? (
        <p className="text-gray-400">No wishes yet.</p>
      ) : (
        <div className="space-y-6">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="rounded-xl bg-[#161616] p-6 shadow"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#e6c47a]">
                    {wish.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(wish.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleApprove(wish)}
                    className={`rounded px-3 py-1 text-xs font-medium ${
                      wish.is_approved
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {wish.is_approved ? 'Approved' : 'Approve'}
                  </button>

                  <button
                    onClick={() => toggleFeature(wish)}
                    disabled={!wish.is_approved}
                    className={`rounded px-3 py-1 text-xs font-medium ${
                      wish.is_featured
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-gray-200'
                    } disabled:opacity-40`}
                  >
                    Feature
                  </button>

                  <button
                    onClick={() => deleteWish(wish.id)}
                    className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-300">
                {wish.message}
              </p>

              <video
                src={wish.video_url}
                controls
                className="w-full rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
