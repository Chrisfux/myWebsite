import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Profile } from "@/lib/database.types";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilePage({ params }: Props) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single() as unknown as { data: Profile | null };

  if (!profile) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="section-container py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/20 to-blue-500/20 flex items-center justify-center text-3xl font-bold text-brand-500 shrink-0">
            {profile.display_name?.[0] || profile.username?.[0] || "?"}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.display_name || profile.username}
                </h1>
                {profile.role === "admin" && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500">
                    Admin
                  </span>
                )}
              </div>
              {isOwnProfile && (
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    Bearbeiten
                  </Button>
                </Link>
              )}
            </div>

            {profile.bio && (
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              {profile.address && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Ort
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {profile.address}
                  </p>
                </div>
              )}
              {profile.website && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Website
                  </p>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand-500 hover:underline mt-0.5 block"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Mitglied seit
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
