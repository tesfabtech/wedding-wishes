"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { Star, Trash2, Upload, X, Download } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
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

export default function GalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);


  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const { data } = await supabaseClient
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setImages(data);
  }

  // 🔥 MULTI UPLOAD (MAX 10)
async function uploadImages(files: FileList) {
  if (files.length > 20) {
    alert("You can upload up to 20 images at once.");
    return;
  }

  setUploading(true);
  setProgress(0);

  const session = await supabaseClient.auth.getSession();
  const accessToken = session.data.session?.access_token;

  if (!accessToken) {
    alert("Not authenticated");
    setUploading(false);
    return;
  }

  let uploadedCount = 0;

  for (const file of Array.from(files)) {
    const filePath = `${Date.now()}-${file.name}`;

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );
          setProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const { data } = supabaseClient.storage
            .from("gallery")
            .getPublicUrl(filePath);

          await supabaseClient.from("gallery_images").insert({
            image_url: data.publicUrl,
          });

          uploadedCount++;
          setProgress(
            Math.round((uploadedCount / files.length) * 100)
          );

          resolve();
        } else {
          reject();
        }
      };

      xhr.onerror = () => reject();

      xhr.open(
        "POST",
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/gallery/${filePath}`,
        true
      );

      xhr.setRequestHeader(
        "Authorization",
        `Bearer ${accessToken}`
      );
      xhr.setRequestHeader("x-upsert", "false");

      const formData = new FormData();
      formData.append("file", file);

      xhr.send(formData);
    });
  }

  setUploading(false);
  setProgress(0);
  fetchImages();
}


  async function toggleFeatured(id: string, current: boolean) {
    await supabaseClient
      .from("gallery_images")
      .update({ is_featured: !current })
      .eq("id", id);

    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, is_featured: !current } : img
      )
    );
  }

  async function deleteImage() {
    if (!deleteId) return;

    await supabaseClient.from("gallery_images").delete().eq("id", deleteId);
    setImages((prev) => prev.filter((img) => img.id !== deleteId));
    setDeleteId(null);
  }


   // STATS
  const totalImages = images.length;
  const featuredImages = images.filter((img) => img.is_featured).length;
  
  return (
    <div className="p-8">
        {/* ambient glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,185,140,0.08),transparent_55%)]" />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(214,185,140,0.08),transparent_55%)]" />

      <div className="mb-10 space-y-2">
          <h1 className="text-4xl sm:text-5xl font-serif bg-linear-to-r from-[#e6c78b] via-white to-[#e6c78b] bg-clip-text text-transparent tracking-tight">
            Gallery
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">
            Manage wedding gallery images. <br /> <br />Total: <strong>{totalImages}</strong> | Featured: <strong>{featuredImages}</strong>
          </p>
        </div>

      <div className="flex items-center gap-4 mb-4">
  {/* Upload Button */}
  <label className="inline-flex items-center gap-2 cursor-pointer
                    text-[#e6c78b] hover:text-white transition">
    <span className="flex items-center gap-2 rounded-sm bg-[#C9A96A] text-xs px-1 py-1 text-[#0b0b0b] hover:bg-[#E6D8B8] hover:scale-105 transition">
      <Upload size={18} />
      Upload Images
    </span>
    <input
      type="file"
      accept="image/*"
      multiple
      hidden
      disabled={uploading}
      onChange={(e) => e.target.files && uploadImages(e.target.files)}
    />
  </label>

  {/* Featured Filter Button */}
  <button
    onClick={() => setShowFeaturedOnly((prev) => !prev)}
    className={`flex items-center justify-center rounded-sm px-1 py-1  text-xs border border-[#2a2a2a]
                transition hover:bg-[#e6c78b]/20 cursor-pointer ${
                  showFeaturedOnly ? "bg-[#e6c78b]/30 text-[#0b0b0b]" : "text-[#e6c78b]"
                }`}
  >
    <Star size={18} className="mr-1" />
    Featured
  </button>
</div>


      {/* PROGRESS */}
      {uploading && (
        <div className="mb-6 max-w-sm">
          <div className="flex justify-between text-xs text-neutral-400 mb-1">
            <span>Uploading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-[#e6c78b] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {images
        .filter((img) => (showFeaturedOnly ? img.is_featured : true))
        .map((img) => (
          <div
            key={img.id}
            className="relative group rounded-2xl overflow-hidden
                       border border-[#2a2a2a]
                       bg-[#121212] shadow-xl"
          >
            {/* FEATURE */}
            <button
              onClick={() => toggleFeatured(img.id, img.is_featured)}
              className={`absolute top-3 right-3 z-10 transition ${
                img.is_featured
                  ? "text-[#e6c78b]"
                  : "text-neutral-500 hover:text-[#e6c78b]"
              }`}
            >
              <Star
                size={20}
                fill={img.is_featured ? "#e6c78b" : "none"}
              />
            </button>

            {/* IMAGE */}
            <img
              src={img.image_url}
              alt="Wedding gallery"
              onClick={() => setPreviewImage(img.image_url)}
              className="w-full h-56 object-cover cursor-pointer
                         transition-transform duration-300
                         group-hover:scale-105"
            />

            {/* DELETE */}
            <button
              onClick={() => setDeleteId(img.id)}
              className="absolute bottom-3 right-3
                         text-neutral-400 hover:text-red-400 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#e6c78b]"
          >
            <X size={28} />
          </button>
          {/* DOWNLOAD BUTTON */}
                <button
                  onClick={() => downloadImage(previewImage)}
                  className="absolute top-6 left-6
                             rounded-full bg-black/70 p-2
                             text-white hover:bg-black transition"
                >
                  <Download size={20} />
                </button>

          <img
            src={previewImage}
            className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-[#141414] border border-[#2a2a2a]
                          rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg text-white mb-4">
              Delete image?
            </h2>
            <p className="text-sm text-neutral-400 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm
                           bg-neutral-800 text-white hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteImage}
                className="px-4 py-2 rounded-lg text-sm
                           bg-red-600 text-white hover:bg-red-500"
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
