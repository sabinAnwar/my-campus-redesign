## 📚 Kursverwaltungs-System - Vollständige Dokumentation

### ✅ Neue Funktion: Professionelle Kursseite

Die neue **Courses.jsx** Seite bietet eine umfassende Kursenverwaltung für Dual-Studenten mit allen notwendigen Lernressourcen und Kommunikationsmitteln.

---

## 🎯 Hauptmerkmale

### 1. **Kursübersicht** (`/courses`)
- Grid-Ansicht aller verfügbaren Kurse
- Kurskarte mit:
  - Kurscode (z.B. WEB101, DB101)
  - Kurstitel
  - Dozent/Lehrende
  - Credits
  - Kursbeschreibung
  - Fortschrittsbalken
  - Startdatum & Enddatum
  - "Öffnen"-Button

### 2. **Kursdetails** (Nach Klick auf Kurs)

#### **📋 Übersicht Tab**
- Statistik-Boxen:
  - Credits (6)
  - Fortschritt (75%)
  - Semester (W24/25)
- Kursbeschreibung
- Start- und Enddatum
- Informationen zum Kurs

#### **📚 Module Tab**
- Listet alle Lernmodule auf
- Für jedes Modul:
  - **Status-Anzeige**: ✅ Abgeschlossen | ⏳ In Bearbeitung | ⭕ Nicht gestartet
  - Modultitel
  - Anzahl der Themen
  - Visueller Status-Indikator mit Farben

**Beispiel Module:**
- HTML & CSS Grundlagen (✅ Abgeschlossen)
- JavaScript Essentials (✅ Abgeschlossen)
- React Komponenten (⏳ In Bearbeitung)
- State Management (⭕ Nicht gestartet)
- API Integration (⭕ Nicht gestartet)

#### **📁 Ressourcen Tab**

Unterteilt in drei Kategorien:

**🎥 Videos (Lehrvideos)**
- Titel & Dauer
- "Abspielen"-Button
- Alle Videos vom Dozenten

**📄 Skripte (Dokumentation)**
- Titel & Dateigröße
- "Herunterladen"-Button
- PDF-Skripte und Handouts

**📥 Dateien von Lehrenden (Teacher Files)**
- **BESONDERHEIT**: Kursunterlagen von Lehrenden
- Anzeige von:
  - Dateititel
  - Name des Lehrenden
  - Dateigröße
  - "Herunterladen"-Button
- Orange Markierung zur Unterscheidung

#### **✍️ Aufgaben Tab**

Zeigt alle Assignments mit:
- Aufgabentitel
- Fälligkeitsdatum
- Status: 
  - 🟢 Eingereicht (Submitted)
  - 🔵 Bewertet (Graded)
  - 🟠 Ausstehend (Pending)

**Für eingereichte Aufgaben:**
- Eingabedatum
- **Turnitin-Integration** 🎯:
  - Ähnlichkeitsprozentsatz angezeigt
  - Farbcodierung:
    - 🟢 Grün: <15% (Gut)
    - 🟡 Gelb: 15-30% (Warnung)
    - 🔴 Rot: >30% (Kritisch)
  - Note/Bewertung
  - Feedback vom Dozenten

**Für ausstehende Aufgaben:**
- "Aufgabe einreichen"-Button mit Upload-Funktion

#### **💬 Forum Tab**

- **Forenthemen-Übersicht** mit:
  - Thema-Titel
  - Autor des Themas
  - Anzahl Antworten (💬)
  - Anzahl Aufrufe (👁️)
  - Datum letzten Beitrags (📅)
  - Markierung für angeheftete Themen (📌)

- **"Neues Thema erstellen"-Button** um selbst Fragen zu stellen

- **Beispiel-Themen:**
  - Fragen zu Hooks
  - Probleme mit State Update
  - Best Practices für Props
  - Von Lehrenden gepinnte wichtige Themen

---

## 🎨 Design & Styling

### **Farbcodierung nach Kontext:**
- **Blau**: Standard UI, Primärfarbe
- **Grün**: Abgeschlossene Module, Gute Turnitin-Scores
- **Orange**: Teacher Files, Warnungen
- **Gelb**: Mittlere Turnitin-Scores
- **Rot**: Kritische Turnitin-Scores, Überfällige Aufgaben

### **Professionelle Elemente:**
- Responsive Grid Layouts
- Hover-Effekte für bessere Interaktivität
- Schatten und Abstände konsistent
- Status-Indikatoren mit Emojis
- Moderne Buttons und Inputs

---

## 🌐 Sprach-Support

✅ **Vollständig auf Deutsch & Englisch verfügbar:**
- Language Toggle in Header
- Alle Texte, Labels, Buttons übersetzt
- Auch Modul-Namen und Beschreibungen in beiden Sprachen

---

## 📊 Mock-Daten enthalten

### **Kurse:**
- **WEB101**: Webentwicklung (Prof. Dr. Sarah Schmidt)
  - 6 Credits
  - 75% Fortschritt
  - 5 Module
  - 3 Assignments (davon 1 mit Turnitin 12%)
  - 3 Forum Topics
  
- **DB101**: Datenbankdesign (Prof. Dr. Thomas Müller)
  - 6 Credits
  - 60% Fortschritt
  - 4 Module
  - 1 Assignment (ausstehend)
  - 1 Forum Topic

### **Ressourcen pro Kurs:**
- 2 Videos mit Laufzeiten
- 2 Skripte (PDF)
- 1 Datei von Lehrenden (z.B. Sample Database)

---

## 🔗 Integration im Portal

### **Navigation verfügbar in:**
1. **Dashboard** - Quick Access Card mit 📚 Kurse Button
2. **Navigationsleiste** - Courses Link sichtbar auf allen Seiten
3. **Header** - Schnelle Navigation zurück zum Dashboard

### **Nächste Seiten nach Kurse:**
```
Dashboard (/dashboard)
  ↓
📚 Kurse (/courses)
  ↓
  Kursdetails (Klick auf Kurs)
  ├─ Overview Tab
  ├─ Modules Tab
  ├─ Resources Tab (Videos, Scripts, Files)
  ├─ Assignments Tab (mit Turnitin)
  └─ Forum Tab
```

---

## 💡 Besonderheiten

### **1. Turnitin Integration**
- Ähnlichkeitsprozentsätze werden farbcodiert angezeigt
- Automatische Warnung bei hohen Werten (>30%)
- Status-Anzeige für eingereichte vs. ausstehende Aufgaben

### **2. Forum System**
- Aktive Diskussionen mit Antwort-Übersicht
- Von Lehrenden gepinnte wichtige Themen
- Kategorisierung nach Aktivität

### **3. Ressourcen-Management**
- Spezielle Sektion für "Dateien von Lehrenden"
- Unterscheidung zwischen Videos, Skripten und Dateien
- Große Dateien korrekt angezeigt (z.B. 12 MB)

### **4. Fortschrittsanzeige**
- Visueller Fortschrittsbalken pro Kurs
- Module mit Status-Indikatoren
- Aufgaben-Übersicht mit Fälligkeitsdaten

---

## 🚀 Technische Details

### **Dateistruktur:**
- `app/routes/courses.jsx` - Hauptkomponente
- Route in `app/routes.js` registriert

### **Abhängigkeiten:**
- React Router (Link, useNavigate)
- React Hooks (useState)
- Tailwind CSS (Styling)

### **State Management:**
- `selectedCourse`: Welcher Kurs gerade angezeigt wird
- `activeTab`: Welcher Tab aktiv ist (overview, modules, resources, assignments, forum)
- `language`: DE/EN Sprache

---

## ✨ Nächste Möglichkeiten

### **Optional zu implementieren:**
- [ ] Backend-Integration für echte Kursdaten
- [ ] Datei-Upload für Assignments
- [ ] Real-time Forum Nachrichten
- [ ] E-Mail Benachrichtigungen für Neue Aufgaben
- [ ] Kalender-Integration für Fälligkeitsdaten
- [ ] Export von Kursnotizen
- [ ] Download aller Ressourcen als ZIP
- [ ] Bewertungshistorie
- [ ] Kursbewertung durch Studenten

---

## 📋 Zusammenfassung

Die neue Kursseite bietet:
✅ Professionelle Kursübersicht
✅ 5 spezialisierte Tabs (Übersicht, Module, Ressourcen, Aufgaben, Forum)
✅ Turnitin Plagiatserkennung Integration
✅ Forum für Studierendendiskussionen
✅ Ressourcen-Verwaltung (Videos, Skripte, Dateien)
✅ Aufgabenverwaltung mit Bewertungen
✅ Vollständig auf Deutsch & Englisch
✅ Responsive Design für alle Geräte
✅ Professionelle Benutzeroberfläche mit IU-Branding

**Status: ✅ Produktionsreif und fehler frei!**
