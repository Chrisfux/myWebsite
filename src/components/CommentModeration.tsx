"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Check, X, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EnrichedComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  status: string;
  created_at: string;
  author_name: string;
  post_title: string;
  post_slug: string;
}

export function CommentModeration({
  comments,
}: {
  comments: EnrichedComment[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [localComments, setLocalComments] = useState(comments);

  const handleModerate = async (
    commentId: string,
    status: "approved" | "rejected"
  ) => {
    const { error } = await supabase
      .from("comments")
      .update({ status } as any)
      .eq("id", commentId);

    if (error) {
      toast.error("Fehler beim Moderieren");
    } else {
      toast.success(
        status === "approved" ? "Kommentar freigegeben" : "Kommentar abgelehnt"
      );
      setLocalComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, status } : c))
      );
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Kommentar wirklich löschen?")) return;
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast.error("Fehler beim Löschen");
    } else {
      toast.success("Kommentar gelöscht");
      setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const pending = localComments.filter((c) => c.status === "pending");
  const reviewed = localComments.filter((c) => c.status !== "pending");

  return (
    <div className="section-container py-12 md:py-20">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <div className="mb-10">
        <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-2">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-foreground">Kommentare</h1>
      </div>

      {pending.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Ausstehend ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((comment) => (
              <Card key={comment.id} className="border-brand-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {comment.author_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                      <Link
                        href={`/blog/${comment.post_slug}`}
                        className="text-xs text-brand-500 hover:underline mt-1 inline-block"
                      >
                        Bei: {comment.post_title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleModerate(comment.id, "approved")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModerate(comment.id, "rejected")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Bereits moderiert ({reviewed.length})
        </h2>
        {reviewed.length > 0 ? (
          <div className="space-y-2">
            {reviewed.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {comment.author_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            comment.status === "approved"
                              ? "text-green-500 bg-green-500/10"
                              : "text-red-500 bg-red-500/10"
                          }`}
                        >
                          {comment.status === "approved"
                            ? "Freigegeben"
                            : "Abgelehnt"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Noch keine moderierten Kommentare.
          </p>
        )}
      </div>
    </div>
  );
}
