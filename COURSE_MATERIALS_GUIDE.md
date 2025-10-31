# Hinweise zum Hinzufügen von Kursmaterialien (PDFs & Dateien)

## 📁 Ordnerstruktur

Alle Kursmaterialien sind unter folgendem Pfad organisiert:

```
public/uploads/studiengaenge/<STUDIENGANG>/<COURSE_CODE>/
├── skript/              # Skripte und Fachbücher
├── musterklausuren/     # Klausuraufgaben und Lösungen
├── foliensaetze/        # Präsentationsfolien
├── podcasts/            # Audio/Video-Materialien
└── toturium/            # Tutorium-Materialien
```

### Aktuelle Struktur:
```
public/uploads/studiengaenge/Wirtschaftsinformatik/
├── MatheGrundlageI/     # Mathematik Grundlagen (MATH101)
│   ├── skript/
│   │   └── 001-2024-0730_IMT102-01_Course_Book.pdf
│   ├── musterklausuren/
│   │   ├── IMT102-01.pdf
│   │   ├── IMT102-01 Musterklausur 2.pdf
│   │   ├── IMT102-01 MK3.pdf
│   │   ├── IMT102-01 Musterlösung.pdf
│   │   ├── IMT102-01 Musterlösung 2.pdf
│   │   └── IMT102-01 MK3 Musterlösung.pdf
│   ├── foliensaetze/
│   ├── podcasts/
│   └── toturium/
└── Webentwicklung/      # Webentwicklung (WEB101)
    ├── skript/
    ├── musterklausuren/
    ├── foliensaetze/
    ├── podcasts/
    └── toturium/
```

## 🎓 Kurse und ihre Codes

| Kurs-ID | Code | Titel | Status |
|---------|------|-------|--------|
| 1 | WEB101 | Webentwicklung | Aktiv |
| 2 | PROG101 | Programmierung | Aktiv |
| 3 | DB101 | Datenbanken | Aktiv |
| 4 | AE101 | Angewandte Ethik | Aktiv |
| 5 | SOP101 | Soziale Organisationen | Aktiv |
| 6 | INFO101 | Informatik Grundlagen | Aktiv |
| 7 | STARTUP101 | Startup & Innovation | Abgeschlossen |
| 8 | MATH101 | Mathematik Grundlagen | Abgeschlossen |
| 9 | BWL101 | BWL Grundlagen | Aktiv |

## 📋 Schritte zum Hinzufügen von Materialien

### 1. Dateien in den öffentlichen Ordner legen

**Für Skripte (Lehrbücher, Skripte):**
```
public/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/skript/
└── Dateiname.pdf
```

**Für Musteklausuren:**
```
public/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/
└── Dateiname.pdf
```

**Für Folien:**
```
public/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/foliensaetze/
└── Dateiname.pdf
```

### 2. Ressourcen in der Courses.jsx registrieren

Öffne `app/routes/courses.jsx` und finde den entsprechenden Kurs in der `courses` Array.

**Beispiel: Mathematik Grundlagen (ID 8)**

```jsx
{
  id: 8,
  code: "MATH101",
  title: "Mathematik Grundlagen",
  // ...
  resources: [
    // Skript hinzufügen:
    {
      id: 118,
      type: "script",
      title: "001-2024-0730_IMT102-01_Course_Book.pdf",
      size: "3.5 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/skript/001-2024-0730_IMT102-01_Course_Book.pdf",
    },
    
    // Musterklausur hinzufügen:
    {
      id: 133,
      type: "musterklausur",
      title: "IMT102-01.pdf",
      size: "1.2 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01.pdf",
    },
  ]
}
```

### 3. Resource Typen

Die folgenden Typen sind verfügbar und erscheinen unter "Ressourcen":

| Typ | Label in UI | Icon | Tab |
|-----|-------------|------|-----|
| `script` | Skripte | 📄 | Resources → Skripte |
| `musterklausur` | Musterklausur | ✓ | Resources → Musterklausur |
| `foliensaetze` | Foliensätze | 📊 | Resources → Foliensätze |
| `podcast` | Podcasts | 🎧 | Resources → Podcasts & Videos |
| `video` | Videos | 🎬 | Videos Tab |
| `onlineTest` | Online Tests | 📋 | Resources → Online Tests & Evaluation |
| `furtherLiterature` | Weiterführende Literatur | 📚 | Resources → Weiterführende Literatur |
| `file` | Weitere Dateien | 📁 | (Allgemein) |

## 🔄 Automatisches Tracking

Wenn ein Student eine Datei öffnet:
1. Die Datei wird als "Zuletzt geöffnet" gespeichert
2. Sie erscheint in "Zuletzt gesuchte Dateien" (`/files/recent`)
3. Die Öffnungszeit wird protokolliert

## 📚 Für Lehrende: Dateien hochladen

Lehrende können Dateien über das Kurs-Dashboard hochladen:

1. Gehe zum entsprechenden Kurs
2. Klicke auf "Ressourcen"
3. Klicke auf "+ Datei hinzufügen" (zukünftige Funktion)
4. Wähle die Datei aus und die Kategorie (Skript, Klausur, etc.)
5. Datei wird automatisch in `public/uploads/...` gespeichert
6. Ressource wird automatisch in `courses.jsx` registriert

### Für jetzt (manuell):

1. Datei in den richtigen Ordner legen:
   ```bash
   public/uploads/studiengaenge/Wirtschaftsinformatik/CourseCode/
   ```

2. In `app/routes/courses.jsx` die neue Ressource hinzufügen

3. Eine eindeutige `id` verwenden (z.B. 201, 202, 203...)

## 🎯 Beispiel: Eine neue Datei zu Webentwicklung hinzufügen

### Schritt 1: Datei in den Ordner legen
```bash
# Datei hochladen zu:
public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/
└── React_Advanced_Patterns.pdf
```

### Schritt 2: In courses.jsx registrieren

Finde den Webentwicklung-Kurs (ID 1, Code WEB101):

```jsx
{
  id: 1,
  code: "WEB101",
  title: "Webentwicklung",
  // ... existing config ...
  resources: [
    // ... existing resources ...
    
    // NEUE DATEI:
    {
      id: 201,  // Neue eindeutige ID
      type: "script",
      title: "React_Advanced_Patterns.pdf",
      size: "2.4 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/React_Advanced_Patterns.pdf",
    },
  ]
}
```

### Schritt 3: Speichern & Testen

1. Speichere die Datei
2. Öffne den Kurs im Browser
3. Klicke auf "Ressourcen"
4. Klicke auf "Skripte" zum Aufklappen
5. Deine neue Datei sollte sichtbar sein
6. Klick darauf sollte die PDF in einem neuen Tab öffnen

## 💡 Tipps

- **Dateinamen:** Verwende aussagekräftige Namen (z.B. "React_Advanced_Patterns.pdf" statt "doc1.pdf")
- **Dateigröße:** Angabe sollte der realen Dateigröße entsprechen
- **Eindeutige IDs:** Für jede neue Ressource eine neue ID verwenden
- **URLs:** Müssen mit `/uploads/...` beginnen und relativ zum `public/` Ordner sein

## 🚀 Zukünftige Verbesserungen

- [ ] Upload-Interface für Lehrende in der Admin-Seite
- [ ] Automatische Dateigrößen-Berechnung
- [ ] Automatisches Thumbnail für PDFs
- [ ] Download-Statistiken
- [ ] Versionsverwaltung für Skripte
- [ ] Integration mit OneDrive/Google Drive
