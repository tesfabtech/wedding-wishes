import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabaseServer'

export default async function AdminDashboard() {
  const supabase = await supabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!admin) redirect('/')

   return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">
        Welcome back 👋
      </h2>

      <p className="mb-8 text-sm text-gray-400">
        Manage wishes and gallery content for the wedding website.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-[#161616] p-6 shadow">
          <h3 className="mb-2 text-lg font-medium text-[#e6c47a]">
            Wishes
          </h3>
          <p className="text-sm text-gray-400">
            Review, approve, feature, or delete guest wishes.
          </p>
        </div>

        <div className="rounded-xl bg-[#161616] p-6 shadow">
          <h3 className="mb-2 text-lg font-medium text-[#e6c47a]">
            Gallery
          </h3>
          <p className="text-sm text-gray-400">
            Upload and manage wedding gallery images.
          </p>
        </div>
      </div>
    </div>
  )
}
