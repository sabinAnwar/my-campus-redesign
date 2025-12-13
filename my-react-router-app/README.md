# IU Student Portal – Internes Hochschulportal

Ein modernes, nutzer:innenzentriertes Hochschulportal für Studierende der **IU International University**, das alle wichtigen Funktionen der Studienorganisation in einer intuitiven Oberfläche vereint.

---

## 📋 Projektbeschreibung

Das **IU Student Portal** ist eine interne Webseite für Studierende des dualen Wirtschaftsinformatik-Studiengangs. Die Anwendung dient als zentrale Anlaufstelle für:

- **Kursverwaltung & Lernmaterialien**: Zugriff auf Kurse, Lernmaterialien und Vorlesungsaufzeichnungen
- **Notenverwaltung**: Übersicht über Prüfungsergebnisse und Transkripte
- **Prüfungsanmeldung (Klausuranmeldung)**: Einfache Anmeldung zu Prüfungen
- **Praxisberichte**: Einreichung und Verwaltung von Praxisberichten für das duale Studium
- **Stundenplan & Terminübersicht**: Kalenderbasierte Ansicht aller Veranstaltungen
- **Raumbuchung**: Buchung von Lernräumen am Campus
- **Bibliothek & Services**: Zugang zu digitalen Bibliotheksressourcen
- **KI-Lernassistent**: KI-gestützte Lernunterstützung und FAQ
- **News & Events**: Aktuelle Neuigkeiten und Veranstaltungen
- **Studentenausweis**: Digitaler Studierendenausweis
- **Bescheinigungen**: Download von Immatrikulationsbescheinigungen und Transkripten

---

## 🛠️ Technologie-Stack

### Frontend-Technologien

| Technologie | Version | Beschreibung |
|-------------|---------|--------------|
| **React** | 19.1.1 | JavaScript-Bibliothek für Benutzeroberflächen |
| **React Router** | 7.9.2 | Routing-Framework mit Server-Side Rendering (SSR) |
| **TypeScript** | 5.9.2 | Typsichere JavaScript-Erweiterung |
| **Tailwind CSS** | 4.1.13 | Utility-First CSS-Framework |
| **Vite** | 7.1.7 | Build-Tool und Development Server |
| **Lucide React** | 0.462.0 | Icon-Bibliothek |
| **Radix UI** | - | Barrierefreie UI-Komponenten |

### Backend-Technologien

| Technologie | Version | Beschreibung |
|-------------|---------|--------------|
| **React Router (Server)** | 7.9.2 | Server-Side Rendering & API-Routes |
| **Prisma** | 6.15.0 | ORM für Datenbankzugriff |
| **Node.js** | - | JavaScript-Runtime |
| **bcryptjs** | 3.0.2 | Passwort-Hashing |
| **Nodemailer** | 7.0.10 | E-Mail-Versand |
| **Vercel** | - | Deployment-Plattform |

### State Management & Zusätzliche Bibliotheken

| Technologie | Beschreibung |
|-------------|--------------|
| **Redux Toolkit** | Globales State Management |
| **React Toastify** | Benachrichtigungssystem |
| **jsPDF** | PDF-Generierung |
| **pptxgenjs** | PowerPoint-Generierung |
| **html2canvas** | Screenshot-Funktionalität |

---

## 🎯 Usability-Prinzipien nach ISO 9241-110

Diese Anwendung wurde unter Berücksichtigung der Dialogprinzipien nach **ISO 9241-110** entwickelt:

### 1. Aufgabenangemessenheit

> Die Webseite ist so aufgebaut, dass Nutzer:innen ihre Ziele ohne unnötige Zwischenschritte erreichen können.

**Umsetzung im Portal:**
- ✅ **Direkte Navigation**: Dashboard zeigt alle wichtigen Informationen auf einen Blick
- ✅ **Prominente Suchfunktion**: Schneller Zugriff auf Kurse und Materialien
- ✅ **Flache Hierarchien**: Alle Inhalte sind in maximal 3 Klicks erreichbar
- ✅ **Kontextbezogene Aktionen**: Relevante Buttons direkt bei den zugehörigen Inhalten

### 2. Selbstbeschreibungsfähigkeit

> Nutzer:innen können jederzeit den aktuellen Status und die möglichen nächsten Schritte erkennen.

**Umsetzung im Portal:**
- ✅ **Fortschrittsanzeigen**: Lernfortschritt in Kursen wird visuell dargestellt
- ✅ **Aktive Navigation**: Aktueller Menüpunkt ist farblich hervorgehoben
- ✅ **Status-Badges**: Anmeldestatus bei Prüfungen klar erkennbar
- ✅ **Feedback-Meldungen**: Toast-Benachrichtigungen informieren über erfolgreich abgeschlossene Aktionen

### 3. Erwartungskonformität

> Das System ist konsistent und entspricht etablierten Konventionen.

**Umsetzung im Portal:**
- ✅ **Logo-Navigation**: Klick auf das IU-Logo führt stets zum Dashboard
- ✅ **Einheitliches Designsystem**: Konsistente Farben, Schriften und Button-Stile
- ✅ **Standardisierte Icons**: Lucide-Icons mit eindeutiger Bedeutung
- ✅ **Responsive Layouts**: Mobile-First-Ansatz mit flexiblem Grid-System

### 4. Erlernbarkeit

> Neue Nutzer:innen können die Bedienung leicht erlernen.

**Umsetzung im Portal:**
- ✅ **Onboarding für Erstis**: Erstsemester-Studierende erhalten eine Einführungstour
- ✅ **Tooltips & Hinweise**: Kontexthilfen erklären Funktionen bei Bedarf
- ✅ **FAQ-Bereich**: KI-gestützter Assistent beantwortet häufige Fragen
- ✅ **Beschreibende Labels**: Klare Beschriftungen aller Navigationspunkte und Buttons

### 5. Steuerbarkeit

> Nutzer:innen behalten die Kontrolle über Abläufe.

**Umsetzung im Portal:**
- ✅ **Formular-Speicherung**: Formulare können jederzeit gespeichert oder abgebrochen werden
- ✅ **Rückgängig-Optionen**: Aktionen wie Kursanmeldungen können storniert werden
- ✅ **Einstellungen**: Personalisierbare Theme- und Spracheinstellungen (DE/EN)
- ✅ **Abmeldung jederzeit möglich**: Logout ist stets im Profil-Menü zugänglich

### 6. Robustheit gegen Nutzungsfehler

> Fehleingaben führen nicht zu schwerwiegenden Problemen.

**Umsetzung im Portal:**
- ✅ **Validierung in Echtzeit**: Formulare prüfen Eingaben direkt beim Tippen
- ✅ **Klare Fehlermeldungen**: Fehler werden mit konkreten Korrekturhinweisen angezeigt
- ✅ **Bestätigungsdialoge**: Kritische Aktionen erfordern explizite Bestätigung
- ✅ **Passwort-Reset**: Sichere Wiederherstellung bei vergessenem Passwort

### 7. Benutzer:innen-Bindung

> Förderung von Motivation und Vertrauen in die Nutzung.

**Umsetzung im Portal:**
- ✅ **Personalisierte Inhalte**: Begrüßung mit Namen, campusspezifische Informationen
- ✅ **Visuelles Feedback**: Animationen und Micro-Interactions
- ✅ **Gamification-Elemente**: Fortschrittsbalken und Erfolgsmeldungen
- ✅ **Premium-Design**: Modernes, ansprechendes UI mit Dark Mode

---

## 📊 Best Practices der Webgestaltung

### Navigation
| Do's ✅ | Don'ts ❌ |
|---------|-----------|
| Flache Hierarchien (max. 3 Klicks) | Komplexe Fakultätsstrukturen |
| Beschreibende Labels | Vage Begriffe wie "Mehr..." |
| Prominente Suchfunktion | Versteckte Suchfelder |
| Mehrere Zugangswege (Menü, Suche) | Nur ein Navigationsweg |

### Buttons
| Do's ✅ | Don'ts ❌ |
|---------|-----------|
| Klar als klickbar erkennbar | Uneinheitliche Stile |
| Einheitliches Designsystem | Mehrere primäre Buttons nebeneinander |
| Kurze, präzise Beschriftungen | Generische Labels wie "OK" |
| Visuelle Hierarchie (primär/sekundär) | Inkonsistente Größen |

### Performance
| Do's ✅ | Don'ts ❌ |
|---------|-----------|
| Ladezeiten < 3 Sekunden | Unoptimierte Bilder |
| Lazy Loading für Bilder | Überladener Code |
| Caching von Ressourcen | Lange Serverantwortzeiten |
| Moderne Bildformate (WebP) | Große PNG/JPEG-Dateien |

### Barrierefreiheit (WCAG)
| Do's ✅ | Don'ts ❌ |
|---------|-----------|
| Alt-Texte für alle Bilder | Fehlende Alternativtexte |
| Ausreichender Farbkontrast | Niedriger Kontrast |
| Tastaturbedienbarkeit | Navigation nur per Maus |
| Screen Reader Unterstützung | Nicht-semantisches HTML |

---

## Installation & Entwicklung

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder pnpm

### Installation

```bash
# Abhängigkeiten installieren
npm install

# Datenbank-Schema erstellen
npx prisma generate
npx prisma db push

# Seed-Daten laden
npx prisma db seed
```

### Entwicklung

```bash
# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Produktion

```bash
# Produktions-Build erstellen
npm run build

# Produktionsserver starten
npm run start
```

---

##  Projektstruktur

```
my-react-router-app/
├── app/
│   ├── components/     # Wiederverwendbare UI-Komponenten
│   ├── contexts/       # React Context Provider (Theme, Language, etc.)
│   ├── data/           # Statische Daten und Konfigurationen
│   ├── lib/            # Utilities und Helper-Funktionen
│   ├── routes/         # Seitenkomponenten und API-Routen
│   │   ├── api/        # Backend API-Endpunkte
│   │   └── _app.*.tsx  # Frontend-Seiten
│   └── styles/         # Globale CSS-Dateien
├── prisma/
│   ├── schema.prisma   # Datenbankschema
│   └── seed.js         # Seed-Daten
├── public/             # Statische Assets
└── build/              # Produktions-Build
```

---

##  Sicherheit

- **Passwort-Hashing**: bcrypt mit Salt-Rounds
- **Session-Management**: Sichere Session-Tokens
- **CSRF-Schutz**: Eingebauter Schutz durch React Router
- **Input-Validierung**: Server- und clientseitige Validierung

---

##  Deployment

Die Anwendung ist für das Deployment auf **Vercel** optimiert. Integration und Speed Insights sind bereits konfiguriert.

```bash
# Mit Vercel CLI deployen
vercel --prod
```

---

##  Literaturverzeichnis

- DIN EN ISO 9241-110:2020 – Interaktionsprinzipien
- W3C Web Content Accessibility Guidelines (WCAG) 2.1
- Krug, S. (2014): Don't Make Me Think
- Google Core Web Vitals

---

##  Lizenz

Dieses Projekt wurde für akademische Zwecke im Rahmen des Wirtschaftsinformatik-Studiums an der IU International University entwickelt.

---

