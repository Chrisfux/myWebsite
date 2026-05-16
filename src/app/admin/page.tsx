import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import type { Metadata } from "next";
import type { Profile } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
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

  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: draftCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  const { count: commentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true });

  const { count: pendingCommentCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const stats = [
    { label: "Beiträge gesamt", value: postCount || 0 },
    { label: "Veröffentlicht", value: publishedCount || 0 },
    { label: "Entwürfe", value: draftCount || 0 },
    { label: "Kommentare gesamt", value: commentCount || 0 },
    {
      label: "Ausstehende Kommentare",
      value: pendingCommentCount || 0,
      highlight: (pendingCommentCount || 0) > 0,
    },
  ];

  return (
    <div className="section-container py-12 md:py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-2">
            Admin
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p
                className={`text-3xl font-bold ${
                  stat.highlight ? "text-brand-500" : "text-foreground"
                }`}
              >
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card hover>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Blogbeiträge
            </h2>
            <p className="text-sm text-muted-foreground">
              Erstelle und verwalte Blogbeiträge.
            </p>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link href="/admin/posts">
              <Button variant="outline">Alle Beiträge</Button>
            </Link>
            <Link href="/admin/posts/new">
              <Button>Neuer Beitrag</Button>
            </Link>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              Kommentare
            </h2>
            <p className="text-sm text-muted-foreground">
              Moderiere eingehende Kommentare.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/admin/comments">
              <Button variant="outline">
                Kommentare verwalten
                {pendingCommentCount !== null && pendingCommentCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-brand-500 text-white">
                    {pendingCommentCount}
                  </span>
                )}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
