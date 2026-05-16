import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendNewCommentNotification } from "@/lib/mail";
import type { Profile, Post } from "@/lib/database.types";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { post_id, content, parent_id } = body;

    if (!post_id || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single() as unknown as { data: Profile | null };

    const status = profile?.role === "admin" ? "approved" : "pending";

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id,
        author_id: user.id,
        content,
        parent_id: parent_id || null,
        status,
      } as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify admin about new comment
    const { data: post } = await supabase
      .from("posts")
      .select("title, slug")
      .eq("id", post_id)
      .single() as unknown as { data: Post | null };

    if (post && profile?.role !== "admin") {
      const { data: author } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single() as unknown as { data: Profile | null };

      const authorName = author?.display_name || author?.username || "Jemand";

      try {
        await sendNewCommentNotification(
          authorName,
          post.title,
          content,
          post.slug
        );
      } catch {
        // Email sending is non-critical
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");

  if (!postId) {
    return NextResponse.json(
      { error: "post_id is required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, profiles(display_name, username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  return NextResponse.json({ data });
}
