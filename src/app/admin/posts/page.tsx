import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import type { Profile, Post } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Admin – Beiträge",
};

export default async function AdminPostsPage() {
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

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false }) as unknown as { data: Post[] | null };

  return (
    <div className="section-container py-12 md:py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-2">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-foreground">Beiträge</h1>
        </div>
        <Link href="/admin/posts/new">
          <Button>Neuer Beitrag</Button>
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/admin/posts/${post.id}`}>
              <Card hover>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.slug}
                      {post.published_at && (
                        <> &middot; {formatDate(post.published_at)}</>
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      post.status === "published"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {post.status === "published" ? "Veröffentlicht" : "Entwurf"}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Noch keine Beiträge
          </h2>
          <p className="mt-2 text-muted-foreground">
            Erstelle deinen ersten Blogbeitrag.
          </p>
          <Link href="/admin/posts/new">
            <Button className="mt-4">Erster Beitrag</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
