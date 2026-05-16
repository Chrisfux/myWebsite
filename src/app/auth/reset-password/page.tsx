"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile/edit`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("E-Mail zum Zurücksetzen wurde versendet.");
    }
    setLoading(false);
  };

  return (
    <div className="section-container py-20 md:py-28">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-foreground text-center">
              Passwort zurücksetzen
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen zu
              erhalten.
            </p>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Wenn ein Konto mit dieser E-Mail existiert, wurde eine E-Mail
                  versendet.
                </p>
                <Link href="/auth/login">
                  <Button variant="outline">Zurück zum Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <Input
                  label="E-Mail"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  Link senden
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
