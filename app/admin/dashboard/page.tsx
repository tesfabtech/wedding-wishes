import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { ImageIcon, Star, MessageSquare, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!admin) redirect("/");

  /* 📊 STATS */
  const [{ count: totalWishes }, { count: pendingWishes }, { count: featuredWishes }, { count: galleryImages }] =
    await Promise.all([
      supabase.from("wishes").select("*", { count: "exact", head: true }),
      supabase
        .from("wishes")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false),
      supabase
        .from("wishes")
        .select("*", { count: "exact", head: true })
        .eq("is_featured", true),
      supabase
        .from("gallery_images")
        .select("*", { count: "exact", head: true }),
    ]);

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-semibold mb-2">
          Welcome back 👋
        </h2>
        <p className="text-sm text-gray-400">
          Here’s what’s happening with your wedding website today.
        </p>
      </div>

      {/* 📊 STATS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Wishes"
          value={totalWishes ?? 0}
          icon={<MessageSquare size={20} />}
        />
        <StatCard
          label="Pending Approval"
          value={pendingWishes ?? 0}
          icon={<Clock size={20} />}
        />
        <StatCard
          label="Featured Wishes"
          value={featuredWishes ?? 0}
          icon={<Star size={20} />}
        />
        <StatCard
          label="Gallery Images"
          value={galleryImages ?? 0}
          icon={<ImageIcon size={20} />}
        />
      </div>

      {/* 🔗 MAIN ACTIONS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* WISHES */}
        <Link
          href="/admin/dashboard/wishes"
          className="group rounded-2xl bg-linear-to-br from-[#1b1b1b] to-[#121212]
                     border border-[#2a2a2a] p-6 shadow-xl
                     hover:border-[#e6c78b]/40 transition"
        >
          <h3 className="text-xl font-medium text-[#e6c78b] mb-2">
            Manage Wishes
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Review, approve, feature, or remove guest wishes.
          </p>
          <span className="text-sm text-[#e6c78b] group-hover:text-white transition">
            Go to wishes →
          </span>
        </Link>

        {/* GALLERY */}
        <Link
          href="/admin/dashboard/gallery"
          className="group rounded-2xl bg-linear-to-br from-[#1b1b1b] to-[#121212]
                     border border-[#2a2a2a] p-6 shadow-xl
                     hover:border-[#e6c78b]/40 transition"
        >
          <h3 className="text-xl font-medium text-[#e6c78b] mb-2">
            Manage Gallery
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Upload, feature, or remove wedding gallery images.
          </p>
          <span className="text-sm text-[#e6c78b] group-hover:text-white transition">
            Go to gallery →
          </span>
        </Link>
      </div>

      {/* 💡 OPTIONAL TIP */}
      <div className="rounded-xl bg-[#161616] border border-[#2a2a2a] p-6 text-sm text-gray-400">
        💡 Tip: Featured wishes and images are highlighted on the public site —
        keep them fresh for the best experience.
      </div>
    </div>
  );
}

/* 🧱 STAT CARD COMPONENT */
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#161616] border border-[#2a2a2a] p-5 shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-[#e6c78b]">{icon}</span>
      </div>
      <p className="text-3xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
