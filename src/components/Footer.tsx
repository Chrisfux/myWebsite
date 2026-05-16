import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Start" },
  { href: "/about", label: "Über mich" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              cf<span className="text-brand-500">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Persönliche Website von Christian Fuchs. Internet-Sicherheit,
              Webentwicklung und mehr.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Kontakt</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/christianfuchs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.whs.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  WHS Gelsenkirchen
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Christian Fuchs. Built with Next.js
            &amp; Supabase.
          </p>
        </div>
      </div>
    </footer>
  );
}
