-- ============================================================
-- Seed Data: Demo posts, comments, and admin setup
-- Run AFTER applying the schema migration
-- ============================================================

-- NOTE: The admin user must be created via Supabase Auth first.
-- After signing up, run:
--   UPDATE profiles SET role = 'admin' WHERE email = 'deine@email.de';
-- Then these seed posts will be associated with that admin ID.

-- We use a subquery to get the admin ID (first admin user)
-- If no admin exists yet, these inserts will simply be skipped.

DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Only insert seed data if admin exists

    -- Seed Post 1
    INSERT INTO posts (title, slug, excerpt, content, status, author_id, published_at, tags, cover_image)
    VALUES (
      'Hallo Welt – Willkommen auf meiner Website',
      'hallo-welt-willkommen',
      'Warum ich diese Website gebaut habe, was mich antreibt und was dich hier erwartet.',
      '## Warum eine eigene Website?\n\nIch bin Christian Fuchs – Masterand in Internet-Sicherheit, wissenschaftlicher Mitarbeiter und leidenschaftlicher Entwickler. Diese Website ist mein digitaler Raum: Blog, Experimentierfeld und Portfolio zugleich.\n\n## Was dich hier erwartet\n\nHier schreibe ich über:\n\n- **Internet-Sicherheit** – Einblicke aus meiner Arbeit am Institut\n- **Webentwicklung** – was ich baue, lerne und manchmal auch wieder einreiße\n- **Persönliches** – Gedanken, Projekte, Geschichten\n\n## Warum selbst gebaut?\n\nKlar, ich hätte auch WordPress nehmen oder einfach einen Substack aufmachen können. Aber:\n\n1. Ich wollte die volle Kontrolle über Code, Daten und Design.\n2. Es macht mir einfach Spaß.\n3. Gelernt ist gelernt.\n\nDer ganze Stack ist Open Source, liegt auf GitHub und nutzt Supabase fürs Backend. Kein Fake, kein Baukasten – handgemacht.\n\nAlso: Stöber rum, hinterlass gerne einen Kommentar und sag Bescheid, wenn dir was auffällt.',
      'published', admin_id, NOW() - INTERVAL '3 days', ARRAY['Persönlich', 'Website'], NULL
    );

    -- Seed Post 2
    INSERT INTO posts (title, slug, excerpt, content, status, author_id, published_at, tags, cover_image)
    VALUES (
      'Warum Internet-Sicherheit kein Nischenthema mehr ist',
      'internet-sicherheit-kein-nischenthema',
      'Sicherheit betrifft uns alle – ob im Homeoffice, beim Online-Banking oder im Smart Home. Ein Blick auf den Status Quo.',
      '## Sicherheit ist kein Feature, sondern ein Grundrecht\n\nSo oft höre ich den Satz: „Mich hacked doch keiner.“ Stimmt – bis es passiert. Und dann ist es meistens zu spät.\n\n## Die aktuelle Lage\n\nWir erleben gerade eine massive Verschiebung:\n\n- **Ransomware** ist zur Industrie geworden\n- **Phishing** wird durch KI immer schwerer erkennbar\n- **IoT-Geräte** sind das Einfallstor Nr. 1 in Privathaushalten\n\nUnd gleichzeitig denken viele: „Das betrifft mich nicht.“\n\n## Was ich daran wichtig finde\n\nAm Institut für Internet-Sicherheit erleben wir täglich, wie verwundbar unsere vernetzte Welt ist. Aber auch: wie viel man mit den richtigen Konzepten erreichen kann.\n\nSicherheit fängt bei den Basics an:\n\n1. **Updates** – klingt langweilig, rettet aber Daten\n2. **Passwort-Manager** – ja, bitte\n3. **2FA** – überall, wo es geht\n4. **Gesunder Menschenverstand** – der beste Virenscanner\n\nIn den nächsten Beiträgen werde ich tiefer in einzelne Themen eintauchen. Bleib dran.',
      'published', admin_id, NOW() - INTERVAL '1 day', ARRAY['Sicherheit', 'Internet'], NULL
    );

    -- Seed Post 3 (Draft, unpublished)
    INSERT INTO posts (title, slug, excerpt, content, status, author_id, tags, cover_image)
    VALUES (
      'Wie ich mein Lagezentrum aufbaue',
      'lagezentrum-aufbau',
      'Vom Konzept zur Realität: Wie ich ein Sicherheits-Lagezentrum von Grund auf entwickle.',
      '## Der Traum vom eigenen Lagezentrum\n\nSchon lange hatte ich die Idee: Ein Ort, an dem Sicherheitsvorfälle in Echtzeit sichtbar werden. Ein Dashboard, das nicht nur alarmiert, sondern auch Kontext liefert.\n\n## Die Architektur\n\nAktuell arbeite ich an:\n\n- **Datensammlung** – verschiedene Quellen zusammenführen\n- **Visualisierung** – damit man Muster sofort erkennt\n- **Automatisierte Reaktion** – wenn X passiert, mach Y\n\n## Warum ich das mache\n\nWeil ich glaube, dass gute Sicherheit nicht reaktiv sein darf. Wir müssen Bedrohungen kommen sehen – nicht nur auf sie reagieren.\n\nMehr dazu, sobald die erste Version steht.',
      'draft', admin_id, ARRAY['Sicherheit', 'Projekte', 'Lagezentrum'], NULL
    );

  END IF;
END $$;
