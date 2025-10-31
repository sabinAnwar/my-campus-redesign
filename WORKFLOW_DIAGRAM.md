# 🎯 Vollständiger Workflow - PDFs in Kursen anzeigen

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEINE PDF-DATEIEN                            │
│                  (Physische Dateien)                            │
└────┬──────────────────────────────────────────────────────────┬─┘
     │                                                          │
     ▼                                                          ▼
┌──────────────────────────────┐          ┌────────────────────────┐
│  public/uploads/...          │          │  public/uploads/...    │
│  MatheGrundlageI/skript/     │          │  Webentwicklung/       │
│  ├─ course_book.pdf ✅       │          │  skript/ (leer)        │
│  musterklausuren/            │          │ (bereit für deine PDFs)│
│  ├─ mk1.pdf ✅               │          │                        │
│  ├─ mk2.pdf ✅               │          │                        │
│  ├─ mk3.pdf ✅               │          │                        │
│  └─ loesungen.pdf ✅         │          │                        │
└──────────┬───────────────────┘          └────────┬───────────────┘
           │                                       │
           │ REGISTRIEREN IN:                      │ REGISTRIEREN IN:
           │ courses.jsx                           │ courses.jsx
           ▼                                       ▼
┌──────────────────────────────┐          ┌────────────────────────┐
│ Kurs: Mathematik Grundlagen  │          │ Kurs: Webentwicklung   │
│ (ID: 8, Code: MATH101)       │          │ (ID: 1, Code: WEB101)  │
│                              │          │                        │
│ resources: [                 │          │ resources: [           │
│   {                          │          │   {                    │
│     id: 118,                 │          │     id: 251,           │
│     type: "script",          │          │     type: "script",    │
│     title: "course_book.pdf",│          │     title: "React.pdf",│
│     url: "/uploads/..."      │          │     url: "/uploads/..." │
│   },                         │          │   },                   │
│   {                          │          │   ...                  │
│     id: 133,                 │          │ ]                      │
│     type: "musterklausur",   │          │                        │
│     title: "mk1.pdf",        │          │                        │
│     url: "/uploads/..."      │          │                        │
│   }                          │          │                        │
│   ... (5 weitere)            │          │                        │
│ ]                            │          │                        │
└──────────┬───────────────────┘          └────────┬───────────────┘
           │                                       │
           │ RENDER IN BROWSER                     │ RENDER IN BROWSER
           ▼                                       ▼
┌──────────────────────────────┐          ┌────────────────────────┐
│ BROWSER - Kursdetail         │          │ BROWSER - Kursdetail   │
│ Ressourcen Tab               │          │ Ressourcen Tab         │
│                              │          │                        │
│ ▼ Skripte                    │          │ ▼ Skripte              │
│   └─ course_book.pdf ✅      │          │   └─ (keine Einträge)  │
│                              │          │ ▼ Musterklausur        │
│ ▼ Musterklausur              │          │   └─ (keine Einträge)  │
│   └─ mk1.pdf ✅              │          │ ▼ Foliensätze          │
│   └─ mk2.pdf ✅              │          │   └─ (keine Einträge)  │
│   └─ mk3.pdf ✅              │          │                        │
│   └─ loesungen.pdf ✅        │          │ (bereit für Lehrende!) │
└──────────┬───────────────────┘          └────────┬───────────────┘
           │                                       │
           │ STUDENT KLICKT AUF DATEI             │ STUDENT KLICKT AUF DATEI
           ▼                                       ▼
┌──────────────────────────────┐          ┌────────────────────────┐
│ PDF öffnet in neuem Tab      │          │ (Nichts passiert -     │
│                              │          │  keine Dateien!)       │
│ ✅ Datei wird als            │          │                        │
│   "zuletzt geöffnet" gespeichert       │                        │
│                              │          │                        │
│ ✅ Erscheint in              │          │                        │
│   "Zuletzt gesuchte Dateien"│          │                        │
│   (/files/recent)           │          │                        │
└──────────────────────────────┘          └────────────────────────┘
```

---

## 📊 AKTUELLER STATUS

### ✅ VERBUNDEN - FUNKTIONIERT
```
✅ Mathematik Grundlagen (MATH101)
   ├─ 1 Skript
   └─ 6 Musterklausuren
```

### ⏳ BEREIT - WARTET AUF PDFs
```
⏳ Webentwicklung (WEB101)
⏳ Programmierung (PROG101)
⏳ Datenbanken (DB101)
⏳ Angewandte Ethik (AE101)
⏳ Soziale Organisationen (SOP101)
⏳ Informatik Grundlagen (INFO101)
⏳ Startup & Innovation (STARTUP101)
⏳ BWL Grundlagen (BWL101)
```

---

## 🚀 NÄCHSTE SCHRITTE

### 1️⃣ Schnellversion (< 5 Minuten)
```
1. Öffne: public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/
2. Speichere deine PDFs dort
3. Öffne: app/routes/courses.jsx
4. Finde: { id: 1, code: "WEB101", ... }
5. Füge zu resources: [ ... ] hinzu:

   {
     id: 250,
     type: "script",
     title: "Dein_PDF_Name.pdf",
     size: "X.X MB",
     url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/Dein_PDF_Name.pdf",
   }

6. Speichern & Browser neu laden
7. Fertig! 🎉
```

### 2️⃣ Ausführliche Version (mit allen Typen)
- Siehe: `COURSE_MATERIALS_GUIDE.md`

### 3️⃣ Template & Beispiele
- Siehe: `COURSE_TEMPLATE.js`

---

## 💾 DATEIÜBERSICHT

| Datei | Zweck |
|-------|-------|
| `app/routes/courses.jsx` | Alle Kurse + PDFs |
| `public/uploads/...` | Physische PDF-Dateien |
| `QUICK_START.md` | Schnelle Anleitung |
| `COURSE_MATERIALS_GUIDE.md` | Detaillierte Dokumentation |
| `COURSE_TEMPLATE.js` | Vollständiges Beispiel |
| `setup-course-folders.sh` | Ordnerstruktur erstellen |

---

## 🔗 WORKFLOW ZUSAMMENGEFASST

```
PDF in Ordner speichern
         ↓
In courses.jsx registrieren
         ↓
Browser neu laden
         ↓
Datei unter "Ressourcen" sichtbar
         ↓
Student klickt darauf
         ↓
PDF öffnet + wird als "zuletzt geöffnet" gespeichert
         ↓
Erscheint in "Zuletzt gesuchte Dateien"
```

---

## 🎯 KURZREFERENZ - ALLE KURSE

```javascript
// Alle aktiven Kurse brauchen noch PDFs:

1  → WEB101    → /Webentwicklung/
2  → PROG101   → /Programmierung/
3  → DB101     → /Datenbanken/
4  → AE101     → /AngewandteEthik/
5  → SOP101    → /SozialeOrganisationen/
6  → INFO101   → /InformatikGrundlagen/
7  → STARTUP101 → /StartupInnovation/ (Abgeschlossen)
8  → MATH101   → /MatheGrundlageI/ ✅ (VERBUNDEN)
9  → BWL101    → /BWLGrundlagen/

Jeder Ordner sollte Unterordner haben:
├── /skript/
├── /musterklausuren/
├── /foliensaetze/
├── /podcasts/
└── /toturium/
```

---

## ✨ FEATURES (Schon eingebaut)

- ✅ PDFs öffnen in neuem Tab
- ✅ Datei wird als "zuletzt geöffnet" protokolliert
- ✅ Wird in `/files/recent` angezeigt
- ✅ "Skript" Badge für PDF/DOC/PPT
- ✅ Zeitstempel wird gespeichert
- ✅ Mehrsprachig (DE/EN)

---

## 🎓 LEHRENDE

Für später: Teacher können direkt im Browser PDFs hochladen
(Diese Funktion ist noch in Planung)

Jetzt: Manuell PDFs in Ordner + `courses.jsx` Eintrag

Unterstützung: ✉️ kontakt@example.com
