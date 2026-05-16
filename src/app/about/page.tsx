import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über mich",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-container py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-brand-500 tracking-widest uppercase mb-4">
            Über mich
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Christian Fuchs
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Bachelor Medieninformatik &middot; Master Internet-Sicherheit
            &middot; Wissenschaftlicher Mitarbeiter
          </p>
        </div>
      </section>

      <section className="section-container pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto space-y-16">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Werdegang
            </h2>
            <div className="space-y-6">
              <div className="relative pl-8 border-l-2 border-brand-500/30">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-brand-500" />
                <h3 className="font-semibold text-foreground">
                  Wissenschaftlicher Mitarbeiter
                </h3>
                <p className="text-sm text-muted-foreground">
                  Institut für Internet-Sicherheit, WHS Gelsenkirchen
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Ich betreue Projekte im Bereich IT-Sicherheit und baue
                  parallel ein Sicherheits-Lagezentrum auf. Ziel ist es,
                  Bedrohungen frühzeitig zu erkennen und automatisiert zu
                  reagieren.
                </p>
              </div>

              <div className="relative pl-8 border-l-2 border-brand-500/30">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-brand-500" />
                <h3 className="font-semibold text-foreground">
                  Master Internet-Sicherheit
                </h3>
                <p className="text-sm text-muted-foreground">
                  Westfälische Hochschule Gelsenkirchen
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Aktuell vertiefe ich mein Wissen in Netzwerksicherheit,
                  Kryptographie und sicheren Systemen.
                </p>
              </div>

              <div className="relative pl-8 border-l-2 border-brand-500/30">
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-brand-500" />
                <h3 className="font-semibold text-foreground">
                  Bachelor Medieninformatik
                </h3>
                <p className="text-sm text-muted-foreground">
                  Westfälische Hochschule Gelsenkirchen
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Mein Grundstein in der Welt zwischen Technologie und
                  Benutzererfahrung. Hier habe ich gelernt, wie man Software
                  nicht nur funktional, sondern auch menschlich denkt.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Was mich antreibt
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ich bin überzeugt, dass gute Sicherheit nicht reaktiv sein darf.
              Wir müssen Bedrohungen kommen sehen – nicht nur auf sie reagieren.
              Deshalb arbeite ich an Systemen, die erkennen, bevor etwas
              passiert.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Gleichzeitig liebe ich es, Dinge zu bauen. Diese Website ist ein
              Beispiel dafür: bewusst selbst entwickelt, um die volle Kontrolle
              zu haben und gleichzeitig etwas Neues zu lernen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Neben der Arbeit
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Wenn ich nicht gerade Code schreibe oder mich mit Sicherheit
              beschäftige, bin ich draußen unterwegs. Ob mit dem{" "}
              <strong className="text-foreground">Fahrrad</strong>, der{" "}
              <strong className="text-foreground">Motorrad</strong>, auf{" "}
              <strong className="text-foreground">Ski</strong> oder beim{" "}
              <strong className="text-foreground">Joggen</strong> – Bewegung
              hilft mir, den Kopf freizubekommen.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Außerdem bin ich neugierig. Ich lerne gerne neue Technologien,
              experimentiere mit Code und probiere mich an Projekten, die mich
              fordern. Diese Website ist eines davon.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-500/10 to-blue-500/10 border border-brand-500/20 p-8">
            <h2 className="text-xl font-bold text-foreground mb-3">
              Lust auf Austausch?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Schau dich auf der Website um, hinterlass einen Kommentar oder
              schreib mir eine Nachricht. Ich freue mich über Feedback,
              Fragen und spannende Diskussionen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
