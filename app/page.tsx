"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: string;
  image_url: string;
}

interface Wish {
  id: string;
  name: string;
  message: string;
  video_url: string | null;
}

/* ---------------------------------- */
/* MODALS */
/* ---------------------------------- */
function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:rotate-90 transition"
        >
          <X size={28} />
        </button>

        <motion.img
          src={src}
          alt="Gallery"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="max-h-[90vh] rounded-2xl shadow-2xl"
        />
      </motion.div>
    </AnimatePresence>
  );
}

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:rotate-90 transition"
        >
          <X size={28} />
        </button>

        <motion.video
          src={src}
          controls
          autoPlay
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="max-h-[90vh] rounded-2xl shadow-2xl"
        />
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------------------------------- */
/* PAGE */
/* ---------------------------------- */
export default function HomePage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: galleryData } = await supabaseClient
      .from("gallery_images")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: wishData } = await supabaseClient
      .from("wishes")
      .select("*")
      .eq("is_approved", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4);

    if (galleryData) setGallery(galleryData);
    if (wishData) setWishes(wishData);
  }

  return (
    <main className="bg-[#0f0f0f] text-[#2C2A27] overflow-hidden">
      {/* HERO */}
<section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
  {/* background image */}
  <motion.div
    initial={{ scale: 1.05 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="absolute inset-0"
  >
    <Image
      src="/hero-wedding.jpg"
      alt="Wedding"
      fill
      className="object-cover"
      priority
    />

    {/* dark gradient mask at bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0b0b0b] via-black/30 to-transparent" />
  </motion.div>

  {/* semi-transparent overlay */}
  <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

  {/* hero content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative z-10 px-6"
  >
    <p className="tracking-[0.35em] text-xs text-[#E6D8B8] mb-8">
      TOGETHER FOREVER
    </p>

    <h1 className="font-serif text-5xl md:text-6xl text-white mb-4 drop-shadow-lg">
      Aman & Asegu
    </h1>

    <p className="text-sm text-[#F3EAD7] max-w-xl mx-auto mb-12 drop-shadow-sm">
      Two hearts united by love, beginning a journey of togetherness,
      commitment, and endless devotion.
    </p>

    <Link
      href="/submit-wish"
      className="inline-block rounded-xl bg-[#C9A96A] px-8 py-3 text-[#0b0b0b] hover:bg-[#E6D8B8] hover:scale-105 transition"
    >
      Submit Your Wish
    </Link>
  </motion.div>
</section>


     {/* OUR STORY */}
<section className="relative py-32 px-6 text-center bg-[#0b0b0b] overflow-hidden">
  {/* ambient background glow */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(214,185,140,0.08),_transparent_55%)]" />

  <div className="relative z-10">
    {/* subtitle */}
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="tracking-[0.35em] text-xs text-[#C9A96A] mb-4"
    >
      OUR JOURNEY
    </motion.p>

    {/* title */}
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="font-serif text-3xl md:text-4xl text-[#F5F2EC] mb-6"
    >
      A Love Written in the Stars
    </motion.h2>

    {/* poetic subtitle */}
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 }}
      className="max-w-xl mx-auto text-sm text-[#8E8A83] mb-14"
    >
      Some stories begin quietly, others with sparks. Ours unfolded with
      destiny, patience, and a promise that felt eternal.
    </motion.p>

    {/* image */}
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="group max-w-5xl mx-auto relative h-screen rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
    >
      {/* image */}
      <Image
        src="/wedding-couple.jpg"
        alt="Our Story"
        fill
        className="object-cover transition duration-1000 group-hover:scale-110"
      />

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* caption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="text-xs tracking-widest text-[#E6D8B8]">
          FOREVER BEGINS HERE
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>



{/* FEATURED GALLERY */}
{gallery.length > 0 && (
  <section className="relative py-28 px-6 bg-[#0b0b0b] overflow-hidden">
    {/* subtle background glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,185,140,0.08),_transparent_55%)]" />

    <div className="relative z-10">
      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-xs tracking-[0.35em] text-[#C9A96A] mb-4">
          MEMORIES CAPTURED
        </p>

        <h3 className="font-serif text-3xl md:text-4xl text-[#F5F2EC] mb-4">
          Cherished Moments
        </h3>

        <p className="max-w-xl mx-auto text-sm text-[#8E8A83]">
          A glimpse into the laughter, love, and unforgettable memories that
          mark the beginning of our forever.
        </p>
      </motion.div>

      {/* gallery grid */}
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-3 gap-6">
        {gallery.map((img) => (
          <motion.button
            key={img.id}
            whileHover="hover"
            initial="rest"
            animate="rest"
            onClick={() => setActiveImage(img.image_url)}
            className="group relative overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* image */}
            <motion.img
              src={img.image_url}
              alt="Wedding moment"
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.1 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-72 w-full object-cover"
            />

            {/* dark overlay */}
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/40"
            />

            {/* hover text */}
            <motion.div
              variants={{
                rest: { opacity: 0, y: 20 },
                hover: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-end p-5"
            >
              <span className="text-xs tracking-wide text-[#EAD9B0]">
                View Moment →
              </span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* view more */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-14 text-center"
      >
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm tracking-wide text-[#C9A96A] hover:text-[#E6D8B8] transition"
        >
          View Full Gallery
          <span className="text-lg">→</span>
        </Link>
      </motion.div>
    </div>
  </section>
)}

     {/* FEATURED WISHES */}
{wishes.length > 0 && (
  <section className="relative py-28 px-6 bg-[#0b0b0b] overflow-hidden">
    {/* ambient glow */}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,185,140,0.08),_transparent_55%)]" />

    <div className="relative z-10">
      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-xs tracking-[0.35em] text-[#C9A96A] mb-4">
          FROM OUR LOVED ONES
        </p>

        <h3 className="font-serif text-3xl md:text-4xl text-[#F5F2EC] mb-4">
          Words of Love & Blessings
        </h3>

        <p className="max-w-xl mx-auto text-sm text-[#8E8A83]">
          Heartfelt messages, prayers, and wishes shared by those who mean the
          most to us on this special journey.
        </p>
      </motion.div>

      {/* wishes */}
      <div className="mx-auto max-w-3xl space-y-8">
        {wishes.map((wish) => (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="relative rounded-3xl bg-gradient-to-br from-[#161616] via-[#111111] to-[#0d0d0d] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          >
            {/* gold accent line */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#C9A96A]/60 to-transparent" />

            {/* name */}
            <p className="font-medium text-sm tracking-wide text-[#E6D8B8] mb-3">
              {wish.name}
            </p>

            {/* message */}
            <p className="text-sm leading-relaxed text-[#B9B5AE] mb-5">
              {wish.message}
            </p>

            {/* video */}
            {wish.video_url && (
              <button
                onClick={() => setActiveVideo(wish.video_url)}
                className="inline-flex items-center gap-2 text-xs tracking-wide text-[#C9A96A] hover:text-[#E6D8B8] transition"
              >
                <Play size={14} />
                Watch Video Message
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* view all */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-14 text-center"
      >
        <Link
          href="/wishes"
          className="inline-flex items-center gap-2 text-sm tracking-wide text-[#C9A96A] hover:text-[#E6D8B8] transition"
        >
          View All Wishes
          <span className="text-lg">→</span>
        </Link>
      </motion.div>
    </div>
  </section>
)}





      {/* MODALS */}
      {activeImage && (
        <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />
      )}
      {activeVideo && (
        <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </main>
  );
}
