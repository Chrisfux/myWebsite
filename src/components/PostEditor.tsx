"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Save, Send, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/lib/database.types";

export function PostEditor({ post }: { post: Post }) {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState((post.tags || []).join(", "));
  const [saving, setSaving] = useState(false);

  const handleSave = async (status: "draft" | "published") => {
    setSaving(true);

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updates: any = {
      title,
      slug,
      excerpt,
      content,
      tags: tagArray,
      status,
    };

    if (status === "published" && post.status !== "published") {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", post.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        status === "published" ? "Beitrag veröffentlicht" : "Entwurf gespeichert"
      );

      if (status === "published" && post.status !== "published") {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "new_post",
            postTitle: title,
            postSlug: slug,
          }),
        });
      }

      router.push("/admin/posts");
      router.refresh();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Beitrag wirklich löschen?")) return;
    setSaving(true);

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Beitrag gelöscht");
      router.push("/admin/posts");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="section-container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Link>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">
              Beitrag bearbeiten
            </h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Titel"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <Input
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="URL-Pfad des Beitrags"
            />
            <Textarea
              label="Kurzbeschreibung"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Inhalt (Markdown)
              </label>
              <textarea
                className="flex min-h-[400px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 transition-colors resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Input
              label="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              helperText="Komma-getrennt"
            />
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="danger" onClick={handleDelete} loading={saving}>
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              loading={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Als Entwurf speichern
            </Button>
            <Button onClick={() => handleSave("published")} loading={saving}>
              <Send className="h-4 w-4 mr-2" />
              {post.status === "published" ? "Aktualisieren" : "Veröffentlichen"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
