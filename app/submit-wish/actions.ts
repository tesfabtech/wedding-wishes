'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function submitWish(formData: {
  name: string
  message: string
  videoUrl?: string
}) {
  const { error } = await supabase.from('wishes').insert({
    name: formData.name,
    message: formData.message,
    video_url: formData.videoUrl ?? null
  })

  if (error) {
    throw new Error('Failed to submit wish')
  }
}
