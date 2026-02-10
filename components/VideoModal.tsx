"use client";

import { X } from "lucide-react";

interface VideoModalProps {
  videoUrl: string;
  name: string;
  onClose: () => void;
}

export default function VideoModal({
  videoUrl,
  name,
  onClose,
}: VideoModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
      <div className="relative bg-[#141414] border border-[#2a2a2a]
                      rounded-2xl w-full max-w-3xl p-6 shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400
                     hover:text-white transition"
          aria-label="Close video"
        >
          <X size={22} />
        </button>

        {/* NAME */}
        <h2 className="text-center text-2xl font-serif text-[#e6c78b] mb-4">
          {name}
        </h2>

        {/* VIDEO */}
        <div className="aspect-video rounded-xl overflow-hidden border border-[#2a2a2a]">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
          />
        </div>
      </div>
    </div>
  );
}
