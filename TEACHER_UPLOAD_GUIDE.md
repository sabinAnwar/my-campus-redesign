# 👨‍🏫 Lehrende: PDFs für Kurse hinzufügen

## 🎯 Schnellübersicht

Deine Kursmaterialien (Skripte, Klausuren, Folien, Podcasts) sollen in folgende Struktur passen:

```
public/uploads/studiengaenge/Wirtschaftsinformatik/[CourseCode]/
├── skript/              ← Lehrbücher & Skripte
├── musterklausuren/     ← Prüfungsaufgaben
├── foliensaetze/        ← Präsentationen & Folien
├── podcasts/            ← Audio/Video
└── tests/               ← Tests & Quizze (optional)
```

---

## 📚 Deine Kurse (Code & Pfad)

| Kurs | Code | Ordner-Name |
|------|------|-------------|
| **Webentwicklung** | WEB101 | `Webentwicklung` |
| **Programmierung** | PROG101 | `Programmierung` |
| **Datenbanken** | DB101 | `Datenbanken` |
| **Angewandte Ethik** | AE101 | `AngewandteEthik` |
| **Soziale Organisationen** | SOP101 | `SozialeOrganisationen` |
| **Informatik Grundlagen** | INFO101 | `InformatikGrundlagen` |
| **Startup & Innovation** | STARTUP101 | `StartupInnovation` |
| **BWL Grundlagen** | BWL101 | `BWLGrundlagen` |

---

## ✅ Schritte zum Hochladen

### 1️⃣ Schritt: Ordnerstruktur erstellen

```bash
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/{skript,musterklausuren,foliensaetze,podcasts,tests}
```

Oder manuell in Explorer:
1. Öffne `website-bauen/my-react-router-app/public/uploads/studiengaenge/Wirtschaftsinformatik/`
2. Erstelle neue Ordner:
   - `Webentwicklung/skript`
   - `Webentwicklung/musterklausuren`
   - `Webentwicklung/foliensaetze`
   - `Webentwicklung/podcasts`
   - `Webentwicklung/tests`

### 2️⃣ Schritt: PDFs in die Ordner kopieren

```
public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/
├── skript/
│   ├── React_Handbook.pdf
│   └── Best_Practices.pdf
├── musterklausuren/
│   ├── Klausur_WS2024.pdf
│   └── Musterlösung_WS2024.pdf
├── foliensaetze/
│   ├── Vorlesung_Woche1.pdf
│   └── Vorlesung_Woche2.xlsx
├── podcasts/
│   └── Web_Dev_Podcast_Episode_1.mp3
└── tests/
    ├── Quiz_1_React_Grundlagen.pdf
    └── Selbstevaluation_Modul_1.pdf
```

### 3️⃣ Schritt: App neu laden

Die PDFs sind dann **automatisch** in der App verfügbar!

---

## 🔗 Wie Lehrende PDFs hinzufügen

### Option A: Dateien lokal platzieren (empfohlen für Lehrende)

1. Öffne `public/uploads/studiengaenge/Wirtschaftsinformatik/[CourseCode]/[Kategorie]/`
2. Kopiere deine PDFs hier rein
3. Speichere & Fertig ✅

Die App verlinkt automatisch auf diese Dateien.

### Option B: Über Upload-Dialog (zukünftig)

```jsx
// Geplante Funktion in Admin-Bereich:
<TeacherUploadPanel courseCode="WEB101" />
// → PDFs werden automatisch hochgeladen
// → Ressourcen in courses.jsx werden aktualisiert
```

---

## 📝 Nützliche Dateinamen-Konventionen

### ✅ Gut:
- `React_Handbook.pdf`
- `SQL_Query_Guide.pdf`
- `Klausur_WS2024.pdf`
- `Musterlösung_Analysis.pdf`
- `Vorlesung_Woche1_Folien.pdf`

### ❌ Schlecht:
- `doc1.pdf`
- `skript.pdf`
- `2024-10-31.pdf`
- `FINAL_FINAL_v2.pdf`

---

## 📂 Vorlage: Webentwicklung (WEB101)

```
public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/

skript/
├── React_Handbook.pdf (3.2 MB)
├── Best_Practices.pdf (1.8 MB)
├── HTML_CSS_Guide.pdf (2.5 MB)
└── JavaScript_Essentials.pdf (4.1 MB)

musterklausuren/
├── Klausur_WS2023.pdf (1.5 MB)
├── Klausur_WS2024.pdf (1.6 MB)
├── Musterlösung_WS2023.pdf (2.1 MB)
└── Musterlösung_WS2024.pdf (2.2 MB)

foliensaetze/
├── Vorlesung_Woche1.pdf (3.2 MB)
├── Vorlesung_Woche2.pdf (2.8 MB)
├── Projektvorlagen.zip (12 MB)
└── Code_Examples.zip (5.3 MB)

podcasts/
├── Web_Dev_Podcast_Episode_1.mp3 (35 MB)
├── Web_Dev_Podcast_Episode_2.mp3 (38 MB)
└── Web_Dev_Podcast_Episode_3.mp3 (32 MB)

tests/
├── Quiz_1_React_Grundlagen.pdf (1.2 MB)
├── Selbstevaluation_Modul_1.pdf (0.8 MB)
├── Online_Test_JavaScript.pdf (2.1 MB)
└── Klausurvorbereitung.pdf (2.3 MB)
```

---

## 🎓 Was Studenten sehen

### Webentwicklung Kurseite:

1. **Ressourcen** Tab → **Skripte**
   - React_Handbook.pdf (Download möglich)
   - Best_Practices.pdf

2. **Ressourcen** Tab → **Musterklausur**
   - Klausur_WS2023.pdf
   - Klausur_WS2024.pdf

3. **Ressourcen** Tab → **Foliensätze**
   - Vorlesung_Woche1.pdf
   - Projektvorlagen.zip

4. **Ressourcen** Tab → **Podcasts**
   - Web_Dev_Podcast_Episode_1

5. **Ressourcen** Tab → **Online Tests und Evaluation**
   - Quiz_1_React_Grundlagen.pdf
   - Online_Test_JavaScript.pdf

6. **Course Feed®** Tab
   - Abonnements & Benachrichtigungen

7. **Videos** Tab
   - Link zu Lehrervideos

8. **Forum** Tab
   - Diskussionen

---

## 🔄 Automatische Verarbeitung

### Wenn Student eine Datei öffnet:

✅ Datei wird als "Zuletzt geöffnet" gespeichert  
✅ Erscheint auf **Seite "Zuletzt gesuchte Dateien"**  
✅ Zeitstempel wird protokolliert  
✅ "Skript"-Badge wird angezeigt (wenn PDF/DOC/PPT)  

### Im Admin-Bereich (zukünftig):

📊 Sichtbar welche Datei wie oft geöffnet wurde  
📊 Download-Statistiken pro Kurs  
📊 Beliebteste Materialien  

---

## ❓ FAQ

**F: Wie lang darf der Dateiname sein?**  
A: Max. 255 Zeichen, aber kurz halten (z.B. unter 50 Zeichen).

**F: Welche Dateitypen sind erlaubt?**  
A: PDF, DOC, DOCX, XLS, XLSX, ZIP, PPT, PPTX, MP3, MP4, PNG, JPG

**F: Wo speichere ich Videos?**  
A: Falls lokal: `podcasts/` Ordner  
Besser: YouTube Link verwenden → weniger Speicher

**F: Können Studenten Dateien hochladen?**  
A: Ja, aber nur über Aufgaben-Abgaben → `Assignments Tab`

**F: Was wenn ich die Datei später ändern möchte?**  
A: Überschreibe einfach die alte Datei mit der neuen  
Der Link bleibt gleich, Studenten sehen automatisch die neue Version

**F: Kann ich Ordner-Zugriff für Lehrende aktivieren?**  
A: Ja! Kontakt Admin für FTP/WebDAV Zugang → einfaches Hochladen

---

## 🚀 Nächste Schritte

1. ✅ Ordner erstellen: `Webentwicklung/{skript,musterklausuren,...}`
2. ✅ PDFs kopieren
3. ✅ App Browser neu laden
4. ✅ Test: Kurs öffnen → Ressourcen → Datei downloaden
5. ✅ Fertig! Studenten können jetzt auf deine Materialien zugreifen

---

## 📞 Support

- **Hilfe beim Hochladen?** → Siehe `QUICK_START.md`
- **Dateistruktur unklar?** → Siehe `COURSE_MATERIALS_GUIDE.md`
- **Technische Probleme?** → Kontakt Admin

---

**Vielen Dank dass du deine Kursmaterialien mit Studenten teilst!** 🎉
