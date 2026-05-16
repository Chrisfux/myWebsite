import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostEditor } from "@/components/PostEditor";
import type { Metadata } from "next";
import type { Profile, Post } from "@/lib/database.types";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Admin – Beitrag bearbeiten",
};

export default async function EditPostPage({ params }: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as unknown as { data: Profile | null };
  if (profile?.role !== "admin") redirect("/");

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single() as unknown as { data: Post | null };

  if (!post) notFound();

  return <PostEditor post={post} />;
}
