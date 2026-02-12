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

  const [
    { count: totalWishes },
    { count: pendingWishes },
    { count: featuredWishes },
    { count: galleryImages },
  ] = await Promise.all([
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
    <div className=" p-6 md:p-10 space-y-12 over ">
      {/* ambient glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,185,140,0.08),transparent_55%)]" />

      {/* HEADER */}
      <div className="relative">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
          Welcome back 👋
        </h2>
        <p className="text-gray-400 max-w-xl">
          Here’s what’s happening with your wedding website today.
        </p>
      </div>

      {/* 📊 STATS GRID */}
      <div className="relative grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4">
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
      <div className="relative grid gap-6 md:grid-cols-2">
        <DashboardCard
          title="Manage Wishes"
          description="Review, approve, feature, or remove guest wishes."
          href="/admin/dashboard/wishes"
        />

        <DashboardCard
          title="Manage Gallery"
          description="Upload, feature, or remove wedding gallery images."
          href="/admin/dashboard/gallery"
        />
      </div>

      {/* 💡 TIP */}
      <div className="relative rounded-2xl bg-[#161616]/80 backdrop-blur-xl border border-white/10 p-6 text-sm text-gray-400 shadow-lg">
        💡 <span className="text-[#D6B98C] font-medium">Pro Tip:</span>{" "}
        Featured wishes and images are highlighted on the public site — keep
        them fresh for the best experience.
      </div>
    </div>
  );
}

/* ========================= */
/* 🧱 STAT CARD COMPONENT */
/* ========================= */

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
    <div className="group relative rounded-3xl bg-linear-to-br from-[#1b1b1b] to-[#121212]
                    border border-white/10 p-6 shadow-xl
                    hover:border-[#D6B98C]/40 transition-all duration-300">
      
      {/* subtle glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 
                      bg-linear-to-br from-[#D6B98C]/5 to-transparent transition" />

      <div className="relative flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400 tracking-wide">
          {label}
        </span>
        <span className="text-[#D6B98C] group-hover:scale-110 transition-transform">
          {icon}
        </span>
      </div>

      <p className="relative text-4xl font-semibold text-white tracking-tight">
        {value}
      </p>
    </div>
  );
}

/* ========================= */
/* 🪄 DASHBOARD ACTION CARD */
/* ========================= */

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-3xl bg-linear-to-br from-[#1b1b1b] to-[#121212]
                 border border-white/10 p-8 shadow-xl
                 hover:border-[#D6B98C]/40 transition-all duration-300 overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-linear-to-r from-[#D6B98C]/5 via-transparent to-transparent 
                      opacity-0 group-hover:opacity-100 transition duration-500" />

      <div className="relative">
        <h3 className="text-xl md:text-2xl font-serif text-[#D6B98C] mb-3">
          {title}
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          {description}
        </p>

        <span className="text-sm text-[#D6B98C] group-hover:text-white transition">
          Open section →
        </span>
      </div>
    </Link>
  );
}
