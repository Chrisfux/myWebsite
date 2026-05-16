# Christian Fuchs – Persönliche Website

Persönliche Website mit Blog, Nutzerkonten, Kommentaren, Likes, Admin-Bereich und E-Mail-Benachrichtigungen.

## Architektur

### Gewählter Stack

| Komponente | Technologie | Begründung |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG, API Routes für serverseitige Logik, optimiert für Vercel |
| **Styling** | Tailwind CSS | Utility-first, Dark Mode, hohe Flexibilität |
| **Backend / Datenbank** | Supabase (PostgreSQL) | Auth, RLS, Echtzeit-Features, einfache Skalierung |
| **E-Mail** | Resend | Modern, zuverlässig, einfaches API |
| **Hosting** | Vercel | Optimal für Next.js, globales CDN, Serverless Functions |
| **Repo / CI** | GitHub | Versionierung, Issues, CI/CD |

### Warum NICHT GitHub Pages

GitHub Pages ist ein **rein statischer Hosting-Dienst**. Es gibt keine Möglichkeit, serverseitigen Code auszuführen. Das bedeutet:

- **API Keys (z. B. Resend) können nie sicher verwendet werden** – sie müssten im Client-Bundle landen
- **Serverseitige Logik (Admin-Prüfungen, E-Mail-Versand) wäre nicht möglich**
- **Supabase Service Role Key könnte nicht geschützt werden**

Daher fällt die Entscheidung **gegen GitHub Pages** und **für Vercel**. GitHub bleibt im Einsatz für Repository, Issues und CI/CD.

### Sicherheitsarchitektur

```
Browser → Next.js (Vercel) → API Routes (Server) → Supabase
                              → Resend (E-Mail)
                              → Supabase Admin Client (Service Role)
```

- Der **einzige öffentliche Key** ist `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Alle privilegierten Aktionen laufen über **Next.js API Routes** (serverseitig)
- Supabase **Row Level Security** stellt sicher, dass Daten nur berechtigt gelesen/geschrieben werden
- Admin-Rolle wird **serverseitig** geprüft (Middleware + API Routes)
- E-Mail-Versand läuft **ausschließlich serverseitig**

## Lokales Setup

### Voraussetzungen

- Node.js 18+
- npm
- Supabase Account (kostenlos)
- Resend Account (kostenlos)

### 1. Repository klonen

```bash
git clone https://github.com/dein-username/christianfuchs-website.git
cd christianfuchs-website
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen

Kopiere `.env.example` zu `.env.local`:

```bash
cp .env.example .env.local
```

Fülle die Werte aus (siehe Abschnitt Konfiguration).

### 4. Supabase einrichten

1. Projekt im Supabase Dashboard erstellen
2. SQL aus `supabase/migrations/00001_initial_schema.sql` im SQL Editor ausführen
3. Optional: `supabase/seed.sql` ausführen
4. Auth-Einstellungen:
   - `http://localhost:3000/auth/callback` als Redirect URL eintragen
   - Site URL auf `http://localhost:3000` setzen

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Produktionssetup

### Supabase (Production)

1. Production-Projekt erstellen
2. Migration wie lokal ausführen
3. Auth-URLs auf Production-Domain anpassen
4. RLS in der UI überprüfen (muss aktiv sein)

### Vercel Deployment

1. Repository mit Vercel verbinden
2. Framework: Next.js
3. Umgebungsvariablen im Vercel Dashboard setzen
4. Deploy

### Domain

Im Vercel Dashboard die eigene Domain hinterlegen.
Bei Supabase die Auth-URLs aktualisieren.

## Supabase-Konfiguration

### Tabellen

| Tabelle | Beschreibung |
|---|---|
| `profiles` | Benutzerprofile (verknüpft mit `auth.users`) |
| `posts` | Blogbeiträge (draft/published) |
| `comments` | Kommentare (pending/approved/rejected) |
| `likes` | Likes (unique pro User + Post) |
| `subscriptions` | E-Mail-Benachrichtigungs-Opt-In |

### Rollen

- **user** – Standardrolle, kann kommentieren und liken
- **admin** – Kann Beiträge erstellen/bearbeiten, Kommentare moderieren

Admin wird gesetzt mit:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'deine@email.de';
```

### Row Level Security (RLS)

RLS ist auf **allen Tabellen aktiviert**. Policies:

- **profiles**: Öffentlich lesbar, nur eigene Bearbeitung
- **posts**: Veröffentlichte öffentlich, Entwürfe nur Admin/Autor
- **comments**: Freigegebene öffentlich, eigene einsehbar, Insert nur eingeloggt
- **likes**: Öffentlich lesbar, Insert/Delete nur eingeloggt
- **subscriptions**: Nur eigene einsehbar/bearbeitbar, Admins sehen alle

## Resend-Konfiguration

1. Account auf [resend.com](https://resend.com) erstellen
2. API-Key generieren
3. Domain verifizieren
4. API-Key in `.env.local` als `RESEND_API_KEY` setzen

### E-Mail-Benachrichtigungen

- **Neuer Blogbeitrag**: Alle abonnierten Nutzer erhalten eine Benachrichtigung
- **Neuer Kommentar**: Admin wird informiert
- **Antwort auf Kommentar**: Nutzer wird informiert (sobald Admin antwortet)

## Umgebungsvariablen

### Öffentlich (dürfen im Frontend sein)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Diese Werte sind für den clientseitigen Gebrauch bestimmt. Der `anon_key` ist durch RLS geschützt.

### Geheim (NIEMALS clientseitig verwenden)

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@deine-domain.de
RESEND_FROM_NAME=Christian Fuchs
```

Diese Werte dürfen **niemals** im Frontend, HTML, JavaScript-Bundle oder im Repository auftauchen. Sie werden ausschließlich in Next.js API Routes (serverseitig) verwendet.

## Security Notes

1. **Supabase Service Role Key** umgeht alle RLS-Policies. Nur in vertrauenswürdigen Server-Umgebungen nutzen.
2. **RLS ist die letzte Verteidigungslinie** – serverseitige Prüfungen sind der primäre Schutz.
3. **Admin-Routen** werden auf zwei Ebenen geschützt:
   - Middleware (Next.js Edge) prüft Session und Rolle
   - API Routes prüfen zusätzlich die Berechtigung
4. **E-Mail-Versand** läuft ausschließlich serverseitig über API Routes.
5. **Keine Secrets im Build** – `.env*.local` ist in `.gitignore`, `.env.example` enthält nur Platzhalter.
6. **Keine secrets-Abfragen im Frontend** – Der anon-key hat nur Zugriff auf das, was RLS erlaubt.
7. **Content Safety** – Blog-Inhalte werden als Markdown gespeichert und mit `rehype-sanitize` gerendert (XSS-Schutz).

## Spätere Erweiterbarkeit

Die Architektur ist auf Erweiterbarkeit ausgelegt:

- **Neue Seiten**: Einfach neue Route in `src/app/` anlegen
- **Neue Bereiche**: Eigene Sektion in Navigation ergänzen
- **API-Routen**: Neue Datei in `src/app/api/` erstellen
- **Datenbank**: Neue Migration in `supabase/migrations/` + TypeScript-Types ergänzen
- **Neue Interaktionen**: Nach gleichem Muster wie Comments/Likes

## Lizenz

MIT – siehe LICENSE Datei.
