import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      {/* Top Nav */}
      <header className="border-b border-[#1f1f1f] bg-[#121212]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-serif text-[#e6c47a]">
            Admin Dashboard
          </h1>

          <nav className="flex gap-6 text-sm">
            <Link
              href="/admin/dashboard"
              className="hover:text-[#e6c47a]"
            >
              Home
            </Link>
            <Link
              href="/admin/dashboard/wishes"
              className="hover:text-[#e6c47a]"
            >
              Wishes
            </Link>
            <Link
              href="/admin/dashboard/gallery"
              className="hover:text-[#e6c47a]"
            >
              Gallery
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  )
}
