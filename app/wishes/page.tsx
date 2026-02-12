import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import WishesList from "@/components/WishesList";

export const dynamic = "force-dynamic";

export default async function WishesPage() {
  const supabase = await supabaseServer();

  const { data: wishes } = await supabase
    .from("wishes")
    .select("id, name, message, video_url, created_at")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return (
    <main className="relative min-h-screen bg-[#0f0f0f] text-gray-200 px-6 py-24 overflow-hidden">
      {/* ambient glow / soft radial light */}
      <div className="pointer-events-none absolute inset-0
                      bg-[radial-gradient(circle_at_top,rgba(214,185,140,0.08),transparent_55%)]" />

      <div className="mx-auto max-w-3xl relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20">
          <p className="tracking-widest text-xs text-[#b89b5e] mb-4">
            BLESSINGS & LOVE
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 drop-shadow-md">
            Wedding Wishes
          </h1>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Heartfelt words from our loved ones — each one a treasure we
            hold close to our hearts.
          </p>
        </div>

        {/* WISHES LIST */}
        {wishes && <WishesList wishes={wishes} />}

        {/* CTA */}
        <div className="mt-20 text-center relative z-10">
          <div
            className="mb-6 h-px w-full bg-linear-to-r
                       from-transparent via-[#2a2a2a] to-transparent"
          />
          <p className="text-sm text-gray-400 mb-6">
            Want to add your blessings?
          </p>

          <Link
            href="/submit-wish"
            className="inline-block rounded-xl
                       bg-[#b89b5e] px-8 py-3
                       text-xs tracking-widest text-black
                       hover:bg-[#a3874e] hover:scale-105 transition"
          >
            SUBMIT YOUR WISH
          </Link>
        </div>
      </div>
    </main>
  );
}
