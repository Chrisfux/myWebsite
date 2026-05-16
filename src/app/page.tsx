import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/BlogCard";
import type { Post } from "@/lib/database.types";

export default async function HomePage() {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3) as unknown as { data: Post[] | null };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-blue-500/5" />
        <div className="section-container relative py-24 md:py-36">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-brand-500 mb-4 tracking-widest uppercase">
              Hallo, ich bin
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
              Christian
              <span className="text-brand-500"> Fuchs</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Sicherheit fasziniert mich. Code begeistert mich.
              <br />
              Masterand in Internet-Sicherheit, wissenschaftlicher Mitarbeiter
              und neugieriger Entwickler.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/blog">
                <Button size="lg">
                  Zum Blog
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Über mich
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="aspect-square w-full max-w-sm rounded-2xl overflow-hidden border border-border/50">
              <Image
                src="/images/profil.jpg"
                alt="Christian Fuchs"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-3">
              Kurzvorstellung
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Bachelor in Medieninformatik.
              <br />
              Master in{" "}
              <span className="text-brand-500">Internet-Sicherheit</span>.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Ich habe meinen Bachelor an der Westfälischen Hochschule
              Gelsenkirchen gemacht und bin jetzt im Master Internet-Sicherheit.
              Parallel arbeite ich als wissenschaftlicher Mitarbeiter am
              Institut für Internet-Sicherheit, wo ich Projekte betreue und ein
              Lagezentrum aufbaue.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                <p className="text-2xl font-bold text-brand-500">Wissenschaft</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Institut für Internet-Sicherheit
                </p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-4 border border-border/40">
                <p className="text-2xl font-bold text-brand-500">Sicherheit</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Master Internet-Sicherheit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 border-y border-border/40">
        <div className="section-container py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-3">
              Neben dem Code
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Auch jenseits des Bildschirms unterwegs
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              In meiner Freizeit fahre ich gerne Fahrrad, Motorrad, Ski und gehe
              joggen. Außerdem lerne ich gerne neue Dinge und probiere mich im
              Coden aus.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Fahrrad", icon: "🚴" },
              { label: "Motorrad", icon: "🏍️" },
              { label: "Ski", icon: "⛷️" },
              { label: "Joggen", icon: "🏃" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center p-6 rounded-xl bg-background border border-border/40 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-3xl mb-2">{item.icon}</span>
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container py-20 md:py-28">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-2">
              Blog
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Neueste Beiträge
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="outline">
              Alle anzeigen
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">Noch keine Beiträge.</p>
          </div>
        )}
      </section>

      <section className="bg-brand-500/5 border-t border-border/40">
        <div className="section-container py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Neugierig geworden?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Stöber durch meine Blogbeiträge, hinterlass einen Kommentar oder
            schreib mir einfach.
          </p>
          <div className="mt-8">
            <Link href="/blog">
              <Button size="lg">
                Blog erkunden
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
