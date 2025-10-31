# 📚 Kursmaterialien - Schnellstart Guide

## Das Problem

Deine PDFs sind in `public/uploads/` aber werden nicht im Kurs angezeigt.

## Die Lösung ✅

### 1️⃣ Schritt: PDFs in den Ordner legen

Platziere deine PDFs hier:
```
public/uploads/studiengaenge/Wirtschaftsinformatik/[CourseCode]/[Kategorie]/
```

**Kategorien:**
- `skript/` - Lehrbücher und Skripte
- `musterklausuren/` - Klausuraufgaben
- `foliensaetze/` - Präsentationsfolien
- `podcasts/` - Audio/Video
- `toturium/` - Tutorium-Materialien

### 2️⃣ Schritt: In `courses.jsx` registrieren

Öffne `app/routes/courses.jsx` und finde deinen Kurs.

**Beispiel: Mathematik Grundlagen**

```jsx
{
  id: 8,
  code: "MATH101",
  title: "Mathematik Grundlagen",
  // ... andere Eigenschaften ...
  resources: [
    // NEUE RESSOURCE HIER HINZUFÜGEN:
    {
      id: 140,  // Eindeutige ID
      type: "musterklausur",  // oder "script", "video", etc.
      title: "IMT102-01 MK3.pdf",  // Dateiname wie im Ordner
      size: "1.5 MB",  // Dateigröße
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 MK3.pdf",
    },
  ]
}
```

### 3️⃣ Schritt: Browser öffnen und testen

1. Öffne den Kurs
2. Klicke auf "Ressourcen"
3. Klicke auf die Kategorie (z.B. "Musterklausur")
4. Deine Datei sollte sichtbar sein! 🎉

---

## 🎯 Aktuelle Kurse (mit Code)

| Code | Kurs | Status |
|------|------|--------|
| **WEB101** | Webentwicklung | Aktiv |
| **PROG101** | Programmierung | Aktiv |
| **DB101** | Datenbanken | Aktiv |
| **AE101** | Angewandte Ethik | Aktiv |
| **SOP101** | Soziale Organisationen | Aktiv |
| **INFO101** | Informatik Grundlagen | Aktiv |
| **STARTUP101** | Startup & Innovation | Abgeschlossen |
| **MATH101** | Mathematik Grundlagen | Abgeschlossen ✅ (mit PDFs) |
| **BWL101** | BWL Grundlagen | Aktiv |

---

## 📝 Resource Typen

Welcher Typ wählen?

| Typ | UI Label | Icon | Wo wird es angezeigt |
|-----|----------|------|---------------------|
| `script` | Skripte | 📄 | Ressourcen → Skripte |
| `musterklausur` | Musterklausur | ✓ | Ressourcen → Musterklausur |
| `file` | Foliensätze | 📊 | Ressourcen → Foliensätze |
| `video` | Videos | 🎬 | Videos Tab |
| `podcast` | Podcasts | 🎧 | Ressourcen → Podcasts |
| `onlineTest` | Online Tests | 📋 | Ressourcen → Online Tests |
| `evaluation` | Evaluation | 📊 | Ressourcen → Online Tests |
| `furtherLiterature` | Lit. | 📚 | Ressourcen → Weiterführende Literatur |

---

## 🔄 Was passiert wenn ein Student die Datei öffnet?

✅ Datei wird in neuem Tab geöffnet  
✅ Wird als "Zuletzt geöffnet" gespeichert  
✅ Erscheint in `/files/recent` (Zuletzt gesuchte Dateien)  
✅ Zeitstempel wird protokolliert  

---

## ⚡ Copy-Paste Template

```javascript
{
  id: 199,  // Ändern auf nächste verfügbare ID
  type: "script",  // Typ ändern je nach Dateityp
  title: "DATEINAME.pdf",  // Wie die Datei heißt
  size: "1.2 MB",  // Dateigröße
  url: "/uploads/studiengaenge/Wirtschaftsinformatik/CourseCode/kategorie/DATEINAME.pdf",
},
```

---

## ❌ Häufige Fehler

| Fehler | Ursache | Lösung |
|--------|--------|--------|
| Datei sichtbar, aber Link funktioniert nicht | Falscher Pfad in `url:` | Pfad mit `/uploads/...` beginnen und genau gleich wie der Ordner schreiben |
| Datei nicht sichtbar | Falsche `id` | Jede Ressource braucht eine eindeutige (höhere) `id` |
| Datei nicht sichtbar | Falsche `type` | `type` muss zu der Kategorie passen (z.B. `musterklausur` für Klausuren) |
| Fehler in Browser Console | Syntax-Fehler in JSON | Kommas prüfen, geschweifte Klammern zählen |

---

## 🚀 Nächster Schritt: Upload für Lehrende

Später können Lehrende direkt PDFs im Browser hochladen:
- Gehe zu Kurs
- Klick "Datei hinzufügen"
- PDF wird automatisch in den richtigen Ordner kopiert
- Ressource wird automatisch registriert

Für jetzt: Manuell in folders kopieren + in `courses.jsx` hinzufügen

---

## 📂 Deine aktuellen Dateien

**Mathematik Grundlagen (MATH101):**
```
✅ Skripte:
   - 001-2024-0730_IMT102-01_Course_Book.pdf (VERBUNDEN)

✅ Musterklausuren:
   - IMT102-01.pdf (VERBUNDEN)
   - IMT102-01 Musterklausur 2.pdf (VERBUNDEN)
   - IMT102-01 MK3.pdf (VERBUNDEN)
   - IMT102-01 Musterlösung.pdf (VERBUNDEN)
   - IMT102-01 Musterlösung 2.pdf (VERBUNDEN)
   - IMT102-01 MK3 Musterlösung.pdf (VERBUNDEN)
```

**Webentwicklung (WEB101):**
```
📁 /public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/
   (Ordner ist leer, bereit für PDFs)
```

---

## 💡 Beispiele

### Beispiel 1: Script zu Webentwicklung hinzufügen

**Schritt 1: Datei in Ordner**
```
public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/
└── React_Advanced_Guide.pdf
```

**Schritt 2: In courses.jsx**
```javascript
// Finde: WEB101 Kurs
{
  id: 1,
  code: "WEB101",
  title: "Webentwicklung",
  // ...
  resources: [
    // Hier hinzufügen:
    {
      id: 250,
      type: "script",
      title: "React_Advanced_Guide.pdf",
      size: "4.2 MB",
      url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/React_Advanced_Guide.pdf",
    },
  ]
}
```

**Schritt 3: Speichern & Testen**  
→ Datei sollte jetzt in "Ressourcen → Skripte" sichtbar sein

### Beispiel 2: Video zu Programmierung hinzufügen

```javascript
{
  id: 251,
  type: "video",
  title: "Python Basics - Episode 1",
  duration: "48 min",
  url: "https://youtube.com/embed/dQw4w9WgXcQ",  // oder lokale URL
},
```

---

## 🆘 Hilfe!

- **Fragen zur Struktur?** → Siehe `COURSE_MATERIALS_GUIDE.md`
- **Brauchst du ein Beispiel?** → Öffne `COURSE_TEMPLATE.js`
- **Fehler beim Speichern?** → Prüfe die `app/routes/courses.jsx` Syntax

---

## 🎉 Zusammenfassung

```
1. PDF in public/uploads/... speichern
2. In courses.jsx eine neue Resource hinzufügen
3. Speichern
4. Browser neu laden
5. Fertig! PDFs sind jetzt sichtbar
```

Das war's! 🚀
