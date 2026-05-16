"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const supabase = createClient();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle();
        setLiked(!!data);
      }
    };
    checkUser();
  }, [postId]);

  const handleToggle = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      if (liked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: userId,
        } as any);
        setLiked(true);
        setCount((c) => c + 1);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={!userId || loading}
        className={cn(
          "gap-2",
          liked && "text-red-500 hover:text-red-600"
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            liked && "fill-red-500"
          )}
        />
        <span className="text-sm font-medium">{count}</span>
      </Button>
      {!userId && (
        <p className="text-xs text-muted-foreground">
          Melde dich an, um zu liken.
        </p>
      )}
    </div>
  );
}
