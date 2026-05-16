import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { PostContent } from "@/components/PostContent";
import { LikeButton } from "@/components/LikeButton";
import { CommentSection } from "@/components/CommentSection";
import type { Profile, Post } from "@/lib/database.types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .single() as unknown as { data: Post | null };

  if (!post) return { title: "Beitrag nicht gefunden" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .single() as unknown as { data: Post | null };

  if (!post) notFound();
  if (post.status !== "published") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single() as unknown as { data: Profile | null }
      : { data: null };

    if (profile?.role !== "admin") notFound();
  }

  const { data: author } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", post.author_id)
    .single() as unknown as { data: Profile | null };

  const { data: likeData } = await supabase
    .from("likes")
    .select("id", { count: "exact" })
    .eq("post_id", post.id);

  const likeCount = likeData?.length ?? 0;

  return (
    <article>
      {post.cover_image && (
        <div
          className="w-full h-64 md:h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.cover_image})` }}
        />
      )}

      <div className="section-container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"
              >
                {tag}
              </span>
            ))}
            {post.published_at && (
              <time className="text-sm text-muted-foreground">
                {formatDate(post.published_at)}
              </time>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {author && (
            <div className="mt-6 flex items-center gap-3 pb-8 border-b border-border/40">
              <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-sm font-medium text-brand-500">
                {author.display_name?.[0] || author.username?.[0] || "?"}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {author.display_name || author.username}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <PostContent content={post.content} />
          </div>

          <div className="mt-10 pt-8 border-t border-border/40">
            <LikeButton postId={post.id} initialCount={likeCount} />
          </div>

          <div className="mt-10 pt-8 border-t border-border/40">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
