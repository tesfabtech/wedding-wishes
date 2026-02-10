import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import GalleryClient from "./GalleryClient";

export default async function AdminGalleryPage() {
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

  return <GalleryClient />;
}
