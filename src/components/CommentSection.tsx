"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Reply, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/lib/database.types";

interface CommentWithAuthor {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  status: string;
  created_at: string;
  author_name: string | null;
  author_avatar: string | null;
}

export function CommentSection({ postId }: { postId: string }) {
  const supabase = createClient();
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
    checkUser();
  }, [postId]);

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true }) as unknown as { data: CommentWithAuthor[] | null };

    if (data) {
      const enriched = await Promise.all(
        data.map(async (comment) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, username, avatar_url")
            .eq("id", comment.author_id)
            .single() as unknown as { data: Profile | null };

          return {
            ...comment,
            author_name: profile?.display_name || profile?.username || "Unbekannt",
            author_avatar: profile?.avatar_url || null,
          };
        })
      );
      setComments(enriched);
    }
  };

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single() as unknown as { data: Profile | null };
      setIsAdmin(profile?.role === "admin");
    }
  };

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      content: newComment.trim(),
      status: isAdmin ? "approved" : "pending",
    } as any);

    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success("Kommentar gespeichert");
      setNewComment("");
      loadComments();
    }
    setLoading(false);
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      parent_id: parentId,
      content: replyContent.trim(),
      status: "approved",
    } as any);

    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success("Antwort gespeichert");
      setReplyContent("");
      setReplyTo(null);
      loadComments();
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast.error("Fehler beim Löschen");
    } else {
      toast.success("Kommentar gelöscht");
      loadComments();
    }
  };

  const handleModerate = async (commentId: string, status: string) => {
    const { error } = await supabase
      .from("comments")
      .update({ status } as any)
      .eq("id", commentId);

    if (error) {
      toast.error("Fehler beim Moderieren");
    } else {
      toast.success(`Kommentar ${status === "approved" ? "freigegeben" : "abgelehnt"}`);
      loadComments();
    }
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  const visibleComments = topLevel.filter(
    (c) => c.status === "approved" || c.author_id === user?.id || isAdmin
  );

  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Kommentare ({comments.filter(c => c.status === "approved" || c.author_id === user?.id || isAdmin).length})
      </h3>

      {user ? (
        <div className="mb-8 space-y-3">
          <Textarea
            placeholder="Schreib einen Kommentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleSubmit} loading={loading} disabled={!newComment.trim()}>
            Kommentar abschicken
          </Button>
          {!isAdmin && (
            <p className="text-xs text-muted-foreground">
              Dein Kommentar wird nach Freischaltung sichtbar.
            </p>
          )}
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-xl bg-secondary/50 border border-border/40 text-center">
          <p className="text-sm text-muted-foreground">
            Melde dich an, um einen Kommentar zu hinterlassen.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {visibleComments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Noch keine Kommentare. Sei der Erste!
          </p>
        ) : (
          visibleComments.map((comment) => (
            <div key={comment.id}>
              <div
                className={`rounded-xl border border-border/40 p-4 ${
                  comment.status !== "approved" ? "bg-amber-500/5 border-amber-500/20" : "bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-xs font-medium text-brand-500">
                      {comment.author_name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {comment.author_name}
                        {isAdmin && comment.author_id !== user?.id && (
                          <span className="ml-2 text-xs text-brand-500">Admin</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.created_at)}
                        {comment.status !== "approved" && (
                          <span className="ml-2 text-amber-500">(ausstehend)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isAdmin && comment.status !== "approved" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModerate(comment.id, "approved")}
                        >
                          Freigeben
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModerate(comment.id, "rejected")}
                        >
                          Ablehnen
                        </Button>
                      </>
                    )}
                    {(user?.id === comment.author_id || isAdmin) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {comment.content}
                </p>

                {user && comment.status === "approved" && (
                  <button
                    onClick={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                    className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Reply className="h-3 w-3" />
                    Antworten
                  </button>
                )}
              </div>

              {replyTo === comment.id && (
                <div className="ml-8 mt-2 space-y-2">
                  <Textarea
                    placeholder="Deine Antwort..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      loading={loading}
                      disabled={!replyContent.trim()}
                    >
                      Antworten
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyContent("");
                      }}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {getReplies(comment.id).length > 0 && (
                <div className="ml-8 mt-2 space-y-2">
                  {(expanded === comment.id
                    ? getReplies(comment.id)
                    : getReplies(comment.id).slice(0, 1)
                  ).map((reply) => (
                    <div
                      key={reply.id}
                      className="rounded-lg border border-border/30 bg-secondary/30 p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center text-[10px] font-medium text-brand-500">
                          {reply.author_name?.[0] || "?"}
                        </div>
                        <p className="text-xs font-medium text-foreground">
                          {reply.author_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(reply.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                  {getReplies(comment.id).length > 1 && (
                    <button
                      onClick={() =>
                        setExpanded(
                          expanded === comment.id ? null : comment.id
                        )
                      }
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {expanded === comment.id ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          Weniger anzeigen
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          {getReplies(comment.id).length - 1} weitere
                          Antworten
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
