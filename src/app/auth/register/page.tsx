"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          username: email.split("@")[0],
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Registrierung erfolgreich! Prüfe deine E-Mails zur Bestätigung."
      );
      router.push("/auth/login");
    }
    setLoading(false);
  };

  return (
    <div className="section-container py-20 md:py-28">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground text-center">
              Registrieren
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Erstelle ein Konto, um kommentieren und liken zu können.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Anzeigename"
                type="text"
                placeholder="Max Mustermann"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                label="E-Mail"
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Passwort"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" loading={loading} className="w-full">
                Registrieren
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Bereits registriert?{" "}
              <Link
                href="/auth/login"
                className="text-brand-500 hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
