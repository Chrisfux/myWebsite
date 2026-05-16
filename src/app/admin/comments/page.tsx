import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";
import { CommentModeration } from "@/components/CommentModeration";
import type { Profile, Comment, Post } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Admin – Kommentare",
};

export default async function AdminCommentsPage() {
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

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false }) as unknown as { data: Comment[] | null };

  const enrichedComments = await Promise.all(
    (comments || []).map(async (comment) => {
      const { data: author } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", comment.author_id)
        .single() as unknown as { data: Profile | null };

      const { data: post } = await supabase
        .from("posts")
        .select("title, slug")
        .eq("id", comment.post_id)
        .single() as unknown as { data: Post | null };

      return {
        ...comment,
        author_name: author?.display_name || author?.username || "Unbekannt",
        post_title: post?.title || "Unbekannt",
        post_slug: post?.slug || "",
      };
    })
  );

  return <CommentModeration comments={enrichedComments} />;
}
