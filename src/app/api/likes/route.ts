import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Like } from "@/lib/database.types";

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
    const { post_id } = body;

    if (!post_id) {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", post_id)
      .eq("user_id", user.id)
      .maybeSingle() as unknown as { data: Like | null };

    if (existing) {
      await supabase.from("likes").delete().eq("id", existing.id);
      return NextResponse.json({ liked: false });
    }

    await supabase.from("likes").insert({
      post_id,
      user_id: user.id,
    } as any);

    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
