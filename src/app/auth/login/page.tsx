"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Erfolgreich eingeloggt");
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="section-container py-20 md:py-28">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground text-center">
              Login
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Melde dich mit deinem Konto an.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              />
              <Button type="submit" loading={loading} className="w-full">
                Login
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Noch kein Konto?{" "}
                <Link
                  href="/auth/register"
                  className="text-brand-500 hover:underline font-medium"
                >
                  Registrieren
                </Link>
              </p>
              <p className="text-sm">
                <Link
                  href="/auth/reset-password"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Passwort vergessen?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
