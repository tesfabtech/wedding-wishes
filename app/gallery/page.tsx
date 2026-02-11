"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { X, Download } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
}

/* ---------------- DOWNLOAD HANDLER ---------------- */
async function downloadImage(url: string) {
  const res = await fetch(url);
  const blob = await res.blob();

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = url.split("/").pop() || "image.jpg";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}

/* ---------------- MODAL ---------------- */
function ImageModal({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white"
      >
        <X size={28} />
      </button>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={() => downloadImage(src)}
        className="absolute top-6 left-6
                   rounded-full bg-black/70 p-2
                   text-white hover:bg-black transition"
      >
        <Download size={20} />
      </button>

      {/* IMAGE */}
      <img
        src={src}
        alt="Gallery"
        className="max-h-[90vh] rounded-xl shadow-2xl"
      />
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 30;

  useEffect(() => {
    fetchImages();
  }, [page]);

  async function fetchImages() {
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  const { data } = await supabaseClient
    .from("gallery_images")
    .select("id, image_url")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (data) {
    setImages((prev) => {
      // combine previous + new
      const combined = [...prev, ...data];

      // remove duplicates by id
      const unique = Array.from(new Map(combined.map(img => [img.id, img])).values());

      return unique;
    });

    if (data.length < LIMIT) setHasMore(false);
  }
}


  return (
    <main className="bg-[#0f0f0f] text-gray-200">
      {/* ambient glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,185,140,0.08),_transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-6 py-24">

        {/* HEADER */}
        <div className="text-center mb-20">
          <p className="tracking-widest text-xs text-[#b89b5e] mb-4">
            CAPTURED MOMENTS
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">
            Our Gallery
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            A collection of precious moments from our journey together.
          </p>
        </div>

        {/* GALLERY GRID */}
        <div className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
  <button
    key={`${img.id}-${idx}`}
    onClick={() => setActiveImage(img.image_url)}
    className="group relative overflow-hidden rounded-2xl shadow hover:scale-[1.02] transition"
  >
    <img
      src={img.image_url}
      alt="Wedding moment"
      className="h-72 w-full object-cover"
    />
  </button>
))}

        </div>

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-[#b89b5e]
                         px-10 py-3 text-xs tracking-widest
                         text-[#b89b5e]
                         hover:bg-[#b89b5e] hover:text-black
                         transition"
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {activeImage && (
        <ImageModal
          src={activeImage}
          onClose={() => setActiveImage(null)}
        />
      )}
    </main>
  );
}
