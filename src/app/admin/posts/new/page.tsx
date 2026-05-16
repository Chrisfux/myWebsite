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
import { ArrowLeft, Save, Send } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(value));
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Nicht eingeloggt");
      setSaving(false);
      return;
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("posts").insert({
      title,
      slug: slug || slugify(title),
      excerpt,
      content,
      tags: tagArray,
      status,
      author_id: user.id,
      published_at: status === "published" ? new Date().toISOString() : null,
    } as any);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        status === "published" ? "Beitrag veröffentlicht" : "Entwurf gespeichert"
      );

      if (status === "published") {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "new_post",
            postTitle: title,
            postSlug: slug || slugify(title),
          }),
        });
      }

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
              Neuer Beitrag
            </h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Titel"
              placeholder="Titel des Beitrags"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <Input
              label="Slug"
              placeholder="titel-des-beitrags"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="Wird automatisch aus dem Titel generiert."
            />
            <Textarea
              label="Kurzbeschreibung"
              placeholder="Kurze Zusammenfassung für die Übersicht..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Inhalt (Markdown)
              </label>
              <textarea
                className="flex min-h-[400px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 transition-colors resize-y"
                placeholder="Schreibe in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Input
              label="Tags"
              placeholder="Sicherheit, Web, Persönlich"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              helperText="Komma-getrennt"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
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
            Veröffentlichen
          </Button>
        </div>
      </div>
    </div>
  );
}
