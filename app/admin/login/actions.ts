'use server'

import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabaseServer'

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await supabaseServer()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/admin/dashboard')
}
