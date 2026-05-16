import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/BlogCard";
import type { Post } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Beiträge über Internet-Sicherheit, Webentwicklung und mehr.",
};

export default async function BlogPage() {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false }) as unknown as { data: Post[] | null };

  const allTags = Array.from(new Set(posts?.flatMap((p) => p.tags || []) ?? []));

  return (
    <>
      <section className="section-container py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-4">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Gedanken, Wissen &amp; Experimente
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Über Internet-Sicherheit, Webentwicklung und alles, was mich sonst
            beschäftigt.
          </p>
        </div>
      </section>

      <section className="section-container pb-20 md:pb-28">
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {allTags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Noch keine Beiträge
            </h2>
            <p className="mt-2 text-muted-foreground">
              Schau bald wieder vorbei – es wird bald Inhalte geben.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
