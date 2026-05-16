"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { Profile, Subscription } from "@/lib/database.types";

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [subscribed, setSubscribed] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single() as unknown as { data: Profile | null };

      if (profile) {
        setDisplayName(profile.display_name || "");
        setBio(profile.bio || "");
        setAddress(profile.address || "");
        setWebsite(profile.website || "");
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("subscribed")
        .eq("user_id", user.id)
        .single() as unknown as { data: Subscription | null };

      if (sub) {
        setSubscribed(sub.subscribed);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        address,
        website,
      } as any)
      .eq("id", user.id);

    if (profileError) {
      toast.error("Fehler beim Speichern");
      setSaving(false);
      return;
    }

    await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        subscribed,
      } as any);

    toast.success("Profil gespeichert");
    setSaving(false);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="section-container py-20 text-center">
        <p className="text-muted-foreground">Lade...</p>
      </div>
    );
  }

  return (
    <div className="section-container py-20 md:py-28">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground">
              Profil bearbeiten
            </h1>
            <p className="text-sm text-muted-foreground">
              Verwalte deine persönlichen Informationen.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Anzeigename"
                placeholder="Max Mustermann"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Textarea
                label="Bio"
                placeholder="Erzähl etwas über dich..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Input
                label="Ort"
                placeholder="Gelsenkirchen"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                label="Website"
                placeholder="https://deine-website.de"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/40">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    E-Mail-Benachrichtigungen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bei neuen Blogbeiträgen benachrichtigt werden
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubscribed(!subscribed)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    subscribed ? "bg-brand-500" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      subscribed ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={saving}>
                  Speichern
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
