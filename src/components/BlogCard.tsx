import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/database.types";

export function BlogCard({ post, index = 0 }: { post: Post; index?: number }) {
  const animationDelay = `${index * 100}ms`;

  return (
    <Link href={`/blog/${post.slug}`} style={{ animationDelay }}>
      <Card
        hover
        className="h-full animate-slide-up opacity-0 [animation-fill-mode:forwards]"
      >
        <div className="aspect-video w-full rounded-t-2xl bg-gradient-to-br from-brand-500/10 to-blue-500/10 flex items-center justify-center border-b border-border/40">
          {post.cover_image ? (
            <div
              className="w-full h-full bg-cover bg-center rounded-t-2xl"
              style={{ backgroundImage: `url(${post.cover_image})` }}
            />
          ) : (
            <svg
              className="w-10 h-10 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400"
              >
                {tag}
              </span>
            ))}
            {post.published_at && (
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDate(post.published_at)}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground leading-snug line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
