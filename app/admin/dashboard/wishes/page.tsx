"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import VideoModal from "@/components/VideoModal";
import {
  Star,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Search,
  Filter,
} from "lucide-react";

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
  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchWishes();
  }, []);

  async function fetchWishes() {
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setWishes(data);
  }

  async function approveWish(id: string) {
    await supabase.from("wishes").update({ is_approved: true }).eq("id", id);

    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, is_approved: true } : w))
    );
  }

  async function unapproveWish(id: string) {
    await supabase
      .from("wishes")
      .update({ is_approved: false, is_featured: false })
      .eq("id", id);

    setWishes((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, is_approved: false, is_featured: false }
          : w
      )
    );
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase
      .from("wishes")
      .update({ is_featured: !current })
      .eq("id", id);

    setWishes((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, is_featured: !current } : w
      )
    );
  }

  async function deleteWish() {
    if (!deleteId) return;

    await supabase.from("wishes").delete().eq("id", deleteId);
    setWishes((prev) => prev.filter((w) => w.id !== deleteId));
    setDeleteId(null);
  }

  /* 🔍 SEARCH + FILTER */
  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) => {
      const matchesSearch = wish.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "approved" && wish.is_approved) ||
        (filter === "pending" && !wish.is_approved) ||
        (filter === "featured" && wish.is_featured);

      return matchesSearch && matchesFilter;
    });
  }, [wishes, search, filter]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif text-[#e6c78b] mb-8">
        Wedding Wishes
      </h1>

      {/* 🔍 CONTROLS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-[#141414] border border-[#2a2a2a]
                       pl-10 pr-4 py-2 text-sm text-white
                       placeholder:text-neutral-500
                       focus:outline-none focus:border-[#e6c78b]/50"
          />
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-52">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="w-full appearance-none rounded-xl bg-[#141414]
                       border border-[#2a2a2a]
                       pl-10 pr-4 py-2 text-sm text-white
                       focus:outline-none focus:border-[#e6c78b]/50"
          >
            <option value="all">All wishes</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      {/* WISHES GRID */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredWishes.map((wish) => (
          <div
            key={wish.id}
            className="relative bg-linear-to-br from-[#1b1b1b] to-[#121212]
                       border border-[#2a2a2a] rounded-2xl p-6 shadow-xl
                       hover:border-[#e6c78b]/40 transition"
          >
            {/* ⭐ FEATURE */}
            <button
              onClick={() =>
                wish.is_approved &&
                toggleFeatured(wish.id, wish.is_featured)
              }
              disabled={!wish.is_approved}
              className={`absolute top-4 right-4 transition ${
                wish.is_featured
                  ? "text-[#e6c78b]"
                  : wish.is_approved
                  ? "text-neutral-500 hover:text-[#e6c78b]"
                  : "text-neutral-700 cursor-not-allowed"
              }`}
            >
              <Star
                size={22}
                fill={wish.is_featured ? "#e6c78b" : "none"}
              />
            </button>

            <p className="text-lg font-medium text-white mb-2">
              {wish.name}
            </p>

            <p className="text-neutral-300 text-sm mb-6">
              {wish.message}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setActiveVideo({
                    url: wish.video_url,
                    name: wish.name,
                  })
                }
                className="flex items-center gap-2 text-sm text-[#e6c78b]
                           hover:text-white transition"
              >
                <Play size={18} />
                Watch video
              </button>

              {!wish.is_approved ? (
                <button
                  onClick={() => approveWish(wish.id)}
                  className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
              ) : (
                <button
                  onClick={() => unapproveWish(wish.id)}
                  className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300"
                >
                  <XCircle size={16} />
                  Remove
                </button>
              )}
            </div>

            <button
              onClick={() => setDeleteId(wish.id)}
              className="absolute bottom-4 right-4 text-neutral-500
                         hover:text-red-400 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <VideoModal
          videoUrl={activeVideo.url}
          name={activeVideo.name}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg text-white mb-4">
              Delete this wish?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteWish}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
