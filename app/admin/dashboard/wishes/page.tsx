"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import VideoModal from "@/components/VideoModal";
import { Star, Trash2, Play, CheckCircle, XCircle, Search, Filter, Users, Clock, Star as StarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Wish {
  id: string;
  name: string;
  message: string;
  video_url: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

type FilterType = "all" | "approved" | "pending" | "featured";

export default function AdminWishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ url: string; name: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchWishes();
  }, []);

  async function fetchWishes() {
    const { data } = await supabaseClient.from("wishes").select("*").order("created_at", { ascending: false });
    if (data) setWishes(data);
  }

  async function approveWish(id: string) {
    await supabaseClient.from("wishes").update({ is_approved: true }).eq("id", id);
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, is_approved: true } : w)));
  }

  async function unapproveWish(id: string) {
    await supabaseClient.from("wishes").update({ is_approved: false, is_featured: false }).eq("id", id);
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, is_approved: false, is_featured: false } : w)));
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabaseClient.from("wishes").update({ is_featured: !current }).eq("id", id);
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, is_featured: !current } : w)));
  }

  async function deleteWish() {
    if (!deleteId) return;
    await supabaseClient.from("wishes").delete().eq("id", deleteId);
    setWishes((prev) => prev.filter((w) => w.id !== deleteId));
    setDeleteId(null);
  }

  /* 🔍 SEARCH + FILTER */
  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) => {
      const matchesSearch = wish.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "approved" && wish.is_approved) ||
        (filter === "pending" && !wish.is_approved) ||
        (filter === "featured" && wish.is_featured);
      return matchesSearch && matchesFilter;
    });
  }, [wishes, search, filter]);

  // Stats
  const total = wishes.length;
  const approved = wishes.filter((w) => w.is_approved).length;
  const pending = wishes.filter((w) => !w.is_approved).length;
  const featured = wishes.filter((w) => w.is_featured).length;

  return (
    <div className=" min-h-screen p-6 sm:p-10 space-y-12">
       {/* ambient glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,185,140,0.08),transparent_55%)]" />
    
      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl sm:text-5xl font-serif bg-linear-to-r from-[#e6c78b] via-white to-[#e6c78b] bg-clip-text text-transparent tracking-tight">
            Wedding Wishes
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Manage, approve and feature heartfelt messages 🎥✨
          </p>
        </div>

        {/* 🔢 STATS SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total" value={total} icon={<Users size={20} />} />
          <StatCard label="Approved" value={approved} icon={<CheckCircle size={20} />} />
          <StatCard label="Pending" value={pending} icon={<Clock size={20} />} />
          <StatCard label="Featured" value={featured} icon={<StarIcon size={20} />} />
        </div>

        {/* 🔍 CONTROLS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-10">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#e6c78b]/60 transition"
            />
          </div>

          {/* Filter */}
          <div className="relative w-full sm:w-52 ">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="w-full appearance-none rounded-2xl bg-[#0f0f0f] backdrop-blur-md border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e6c78b]/60 transition cursor-pointer"
            >
              <option value="all">All wishes</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {/* WISHES GRID */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredWishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative rounded-3xl p-6 bg-white/3 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-[#e6c78b]/50 hover:shadow-[0_10px_60px_rgba(230,199,139,0.15)] transition-all duration-300"
            >
              {/* ⭐ FEATURE */}
              <button
                onClick={() => wish.is_approved && toggleFeatured(wish.id, wish.is_featured)}
                disabled={!wish.is_approved}
                className={`absolute top-4 right-4 transition cursor-pointer ${
                  wish.is_featured ? "text-[#e6c78b]" : wish.is_approved ? "text-neutral-500 hover:text-[#e6c78b]" : "text-neutral-700 cursor-not-allowed"
                }`}
              >
                <Star size={22} fill={wish.is_featured ? "#e6c78b" : "none"} />
              </button>

              <p className="text-lg font-medium text-white mb-1">{wish.name}</p>

              {/* Status Badges */}
              <div className="mb-3 flex items-center gap-2">
                {wish.is_featured && (
                  <span className="px-2 text-[11px] rounded-full bg-[#e6c78b]/20 text-[#e6c78b] border border-[#e6c78b]/40">
                    Featured
                  </span>
                )}
                {wish.is_approved ? (
                  <span className="px-2 text-[11px] rounded-full bg-green-500/20 text-green-400 border border-green-500/40">
                    Approved
                  </span>
                ) : (
                  <span className="px-2  text-[11px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    Pending
                  </span>
                )}
              </div>

              <p className="text-neutral-300 text-sm mb-6">{wish.message}</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setActiveVideo({
                      url: wish.video_url,
                      name: wish.name,
                    })
                  }
                  className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-[#e6c78b]/10 text-[#e6c78b] hover:bg-[#e6c78b] hover:text-black transition cursor-pointer"
                >
                  <Play size={18} />
                  Watch video
                </button>

                {!wish.is_approved ? (
                  <button
                    onClick={() => approveWish(wish.id)}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black transition cursor-pointer"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => unapproveWish(wish.id)}
                    className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-black transition cursor-pointer"
                  >
                    <XCircle size={16} />
                    Remove
                  </button>
                )}
              </div>

              <button
                onClick={() => setDeleteId(wish.id)}
                className="absolute bottom-4 right-4 text-neutral-500 hover:text-red-400 transition cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}

          {filteredWishes.length === 0 && (
            <div className="text-center py-20 text-neutral-500 col-span-full">
              <p className="text-lg mb-2">No wishes found</p>
              <p className="text-sm">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

        {/* VIDEO MODAL */}
        {activeVideo && (
          <VideoModal videoUrl={activeVideo.url} name={activeVideo.name} onClose={() => setActiveVideo(null)} />
        )}

        {/* DELETE CONFIRM */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <h2 className="text-lg text-white mb-4">Delete this wish?</h2>
              <p className="text-sm text-neutral-400 mb-6">This action cannot be undone.</p>

              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer">
                  Cancel
                </button>
                <button onClick={deleteWish} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🧱 STAT CARD COMPONENT */
function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/3 backdrop-blur-md border border-white/10 shadow-md">
      <div>
        <p className="text-sm text-neutral-400">{label}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
      <div className="text-[#e6c78b]">{icon}</div>
    </div>
  );
}
