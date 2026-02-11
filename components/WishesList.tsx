"use client";

import { useState, useMemo } from "react";
import { Play, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Wish {
  id: string;
  name: string;
  message: string;
  video_url?: string | null;
}

const ITEMS_PER_LOAD = 6;

export default function WishesList({ wishes }: { wishes: Wish[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  /* 🔍 Filter by name */
  const filteredWishes = useMemo(() => {
    return wishes.filter((wish) =>
      wish.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, wishes]);

  /* 📦 Visible wishes */
  const visibleWishes = filteredWishes.slice(0, visibleCount);

  return (
    <>
      {/* SEARCH BAR */}
      <div className="mb-10 flex justify-end">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(ITEMS_PER_LOAD);
            }}
            className="w-full rounded-full bg-[#141414]
                       border border-[#1f1f1f]
                       pl-9 pr-4 py-2 text-sm
                       text-gray-200 placeholder-gray-500
                       focus:outline-none focus:border-[#b89b5e]
                       transition"
          />
        </div>
      </div>

      {/* WISHES */}
      <div className="space-y-6">
        <AnimatePresence>
          {visibleWishes.map((wish) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              whileHover={{ scale: 1.02, boxShadow: "0 15px 30px rgba(184,155,94,0.2)" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#1f1f1f]
                         bg-[#141414] px-6 py-6 shadow-sm hover:shadow-lg"
            >
              <p className="font-medium text-[#e6c78b] mb-2 text-lg">
                {wish.name || "Anonymous"}
              </p>

              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {wish.message}
              </p>

              {wish.video_url && (
                <button
                  onClick={() => setActiveVideo(wish.video_url!)}
                  className="group flex w-full items-center gap-3
                             rounded-lg bg-[#1b1b1b] px-4 py-3
                             text-xs tracking-wide text-[#b89b5e]
                             hover:bg-[#222] transition"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center
                               rounded-full bg-[#b89b5e] text-black
                               group-hover:scale-110 transition"
                  >
                    <Play size={14} />
                  </span>
                  WATCH VIDEO MESSAGE
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LOAD MORE */}
      {visibleCount < filteredWishes.length && (
        <div className="mt-12 text-center">
          <motion.button
            onClick={() => setVisibleCount((c) => c + ITEMS_PER_LOAD)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full border border-[#2a2a2a]
                       px-8 py-3 text-xs tracking-widest
                       text-gray-300 hover:border-[#b89b5e]
                       hover:text-[#b89b5e] transition"
          >
            LOAD MORE
          </motion.button>
        </div>
      )}

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            key="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80
                        flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0
                           text-gray-300 hover:text-white transition"
              >
                <X size={28} />
              </button>

              <div className="rounded-2xl overflow-hidden bg-black shadow-xl">
                <video
                  src={activeVideo}
                  controls
                  autoPlay
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
