import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendNewPostNotification,
  sendNewCommentNotification,
} from "@/lib/mail";
import type { Profile, Subscription } from "@/lib/database.types";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as unknown as { data: Profile | null };

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();

    switch (body.type) {
      case "new_post": {
        const admin = createAdminClient();

        const { data: subscriptions } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("subscribed", true) as unknown as { data: Subscription[] | null };

        if (subscriptions) {
          for (const sub of subscriptions) {
            const { data: userData } = await admin.auth.admin.getUserById(
              sub.user_id
            );
            if (userData?.user?.email) {
              try {
                await sendNewPostNotification(
                  userData.user.email,
                  body.postTitle,
                  body.postSlug
                );
              } catch {
                // continue sending to others
              }
            }
          }
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
