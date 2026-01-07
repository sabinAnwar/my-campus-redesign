# Technische Dokumentation: MyCampus Redesign – IU Student Portal MVP


## Technologieauswahl und Implementierung

**Autor:** Entwicklungsteam  
**Version:** 1.3  
**Datum:** Januar 2026

---

## 1. Einleitung

Diese Dokumentation beschreibt die technologische Architektur des neu entwickelten **MyCampus Student Portals** der IU Internationalen Hochschule. Das Projekt ist ein vollständiges Redesign der bestehenden MyCampus-Plattform mit dem Ziel, eine modernere, schnellere und benutzerfreundlichere Studienverwaltung zu schaffen.

Das neue MyCampus Portal wurde als MVP (Minimum Viable Product) entwickelt und ersetzt die bisherige Plattform durch eine zeitgemäße Webanwendung. Die folgenden Abschnitte dokumentieren, welche Technologien für das neue MyCampus eingesetzt werden und warum diese gewählt wurden.

### 1.1 Installation und lokaler Start

```bash
npm install
npx prisma generate
npm run dev
```

---

## 2. Frontend des MVPs

Das Frontend bezeichnet den sichtbaren Teil der MyCampus-Anwendung, mit dem Studierende direkt interagieren – von der Anmeldung über den Stundenplan bis zur Noteneinsicht.

### 2.1 React und React Router

Das neue MyCampus nutzt **React** (Version 19.1.1) als JavaScript-Bibliothek zur Erstellung der Benutzeroberfläche. React nutzt das sogenannte *Virtual DOM* – eine virtuelle Kopie der Webseite im Speicher, die Änderungen effizient berechnet, bevor sie auf der echten Seite angezeigt werden (Abramov & Clark, 2015).

Für die Navigation zwischen den MyCampus-Seiten (Dashboard, Stundenplan, Noten, etc.) wird **React Router** (Version 7.9.2) eingesetzt. Das Framework nutzt ein dateibasiertes *Routing*-System: Jede Datei im `routes`-Ordner entspricht automatisch einer URL (Hunt & Thomas, 2003).

### 2.2 TypeScript

Für die Entwicklung des MyCampus Portals wird **TypeScript** (Version 5.9.2) verwendet. TypeScript erweitert JavaScript um *statische Typisierung* – der Code wird vor der Ausführung auf Fehler geprüft. Studien zeigen, dass dies die Fehlerrate um bis zu 15 Prozent reduziert (Gao et al., 2017).

### 2.3 Tailwind CSS

Das Design des neuen MyCampus basiert auf **Tailwind CSS** (Version 4.1.13), einem *Utility-First CSS Framework*. Statt eigene CSS-Klassen zu schreiben, werden vorgefertigte Hilfsklassen direkt im HTML verwendet (z.B. `p-4` für Padding, `text-blue-500` für blaue Schrift). Dies ermöglicht das konsistente IU-Branding im gesamten Portal.

### 2.4 Vite

**Vite** (Version 7.1.7) ist das *Build-Tool* des MyCampus Portals. Es kompiliert den Quellcode in browserfähiges JavaScript. Vite nutzt *Hot Module Replacement* (HMR) – Änderungen am Code werden sofort im Browser sichtbar, ohne die Seite neu zu laden.

### 2.5 State Management

*State Management* bezeichnet die Verwaltung von Anwendungszuständen (z.B. "Ist der Nutzer eingeloggt?"). Die Anwendung nutzt die **React Context API** mit drei Contexts:

| Context | Funktion |
|---------|----------|
| `LanguageContext` | Speichert die Sprache (DE/EN) |
| `ThemeContext` | Steuert Dark/Light Mode |
| `ScreenReaderContext` | Aktiviert Sprachausgabe |

### 2.6 PDF-Generierung

Das MyCampus Portal generiert Dokumente direkt im Browser. **jsPDF** (Version 3.0.3) und **html2canvas** (Version 1.4.1) ermöglichen die Erstellung von PDF-Dokumenten. Dies wird für MyCampus-Immatrikulationsbescheinigungen und digitale Studierendenausweise verwendet.

### 2.7 Neuropsychologische Design-Philosophie und visuelle Ergonomie

Die visuelle Architektur des Portals basiert auf einer synergetischen Verbindung der offiziellen IU-Branding-Vorgaben mit etablierten Prinzipien der Wahrnehmungspsychologie. Die chromatische Basis wurde hierzu mittels des **Edge Design Pickers** direkt aus der Systemumgebung der IU Internationalen Hochschule extrahiert, um eine lückenlose Markenidentät zu gewährleisten. Diese Farben sind systemweit als CSS Custom Properties in der `app.css` implementiert: **IU Blue** (#245EEB), **IU Green** (#55FF4D), **IU Pink** (#FE4DF9), **IU Orange** (#FFA933), **IU Red** (#FF4757) und **IU Purple** (#A74EE2). In der Anwendung folgt das Portal einer dedizierten Design-Logik: Das dominante Blau fungiert als kognitiver Anker zur Förderung der Vigilanz und Konzentration, während die grüne Akzentuierung zur Visualisierung von Kompetenzerfolgen eingesetzt wird, um positive Verstärkungsprozesse zu triggern. Zeitkritische Interaktionen werden durch die Salienz von Orange und Rot gesteuert, um die Aufmerksamkeitsleistung situational zu steigern. Diese funktionale Farballokation dient der Reduktion des kognitiven Workloads (Cognitive Load Theory) und stabilisiert das mentale Modell des Nutzers über beide Theme-Modi hinweg. Technisch wird dies durch eine hybride Kontraststrategie ergänzt, die strikt die **WCAG 2.1 Standards** erfüllt. Hierbei wird sichergestellt, dass großflächige Texte (Large-scale text) und deren grafische Repräsentationen ein Kontrastverhältnis von mindestens **3:1** aufweisen. Während der **Dark Mode** (#000000) die Lichtemission zur Prävention von Asthenopie terminiert und lumineszierende Akzente zur Orientierung nutzt, maximiert der **Light Mode** (#F3F3F5) die visuelle Dekodierungsrate durch eine Papier-Metapher. Die resultierende visuelle Hierarchie sichert eine barrierefreie Studienverwaltung und transformiert das IU-Markenbild in eine funktionale digitale Lernumgebung.











---

## 3. Backend des MVPs

Das Backend bezeichnet den serverseitigen Teil des MyCampus Portals, der Studierendendaten verarbeitet, Authentifizierung durchführt und mit der Datenbank kommuniziert.

### 3.1 Node.js

Das MyCampus Backend läuft auf **Node.js** als Laufzeitumgebung für JavaScript. Node.js nutzt *Non-blocking I/O* – das bedeutet, der Server wartet nicht auf langsame Operationen (z.B. Datenbankabfragen), sondern bearbeitet währenddessen andere Anfragen (Tilkov & Vinoski, 2010).

### 3.2 Prisma ORM

Für die Datenbankanbindung des MyCampus Portals wird **Prisma** (Version 6.15.0) als *Object-Relational Mapper* (ORM) eingesetzt. Ein ORM übersetzt zwischen der objektorientierten Programmiersprache und der relationalen Datenbank. Statt SQL-Befehle zu schreiben, arbeitet man mit TypeScript-Objekten:

```typescript
// Prisma-Abfrage statt SQL
const user = await prisma.user.findUnique({ where: { id: 1 } });
```

### 3.3 PostgreSQL mit Neon

Alle MyCampus-Daten (Studierende, Kurse, Noten, Stundenpläne) werden in **PostgreSQL** gespeichert. PostgreSQL ist *ACID-konform*, was bedeutet: Transaktionen sind atomar, konsistent, isoliert und dauerhaft (Stonebraker & Rowe, 1986).

**Neon** ist der Cloud-Hosting-Provider für die MyCampus-Datenbank. Vorteile:
- *Serverless*: Keine Serververwaltung nötig
- *Scale-to-Zero*: Kostenlos bei Inaktivität
- *Connection Pooling*: Effiziente Verbindungsverwaltung

### 3.4 Sicherheit

Für die MyCampus-Authentifizierung verschlüsselt **bcryptjs** (Version 3.0.2) Passwörter mit einem langsamen Hash-Algorithmus. Die Langsamkeit ist beabsichtigt – sie erschwert Brute-Force-Angriffe auf Studierenden-Accounts (Provos & Mazières, 1999).

### 3.5 E-Mail-Service

Das MyCampus Portal versendet Benachrichtigungen (z.B. Passwort-Reset, Kurserinnerungen) über **Nodemailer** (Version 7.0.10). Die Konfiguration nutzt Gmail mit App-spezifischen Passwörtern.

---

## 4. Projektarchitektur des MyCampus Portals

### 4.1 Ordnerstruktur (visuell)

```
my-react-router-app/
│
├── app/                          # Hauptanwendung
│   ├── components/               # UI-Komponenten
│   │   ├── dashboard/            # Dashboard-Bereich
│   │   ├── auth/                 # Login/Registrierung
│   │   ├── certificates/         # Bescheinigungen
│   │   ├── schedule/             # Stundenplan
│   │   ├── tasks/                # Aufgaben
│   │   └── ui/                   # Wiederverwendbare UI-Elemente
│   │   └──....
│   │
│   ├── contexts/                 # React Context (State Management)
│   │   ├── LanguageContext.tsx   # Sprachverwaltung
│   │   ├── ThemeContext.tsx      # Dark/Light Mode
│   │   └── ScreenReaderContext.tsx
│   │
│   ├── routes/                   # Seiten (dateibasiertes Routing)
│   │   ├── _app.dashboard.tsx    # /dashboard
│   │   ├── _app.schedule.tsx     # /schedule
│   │   ├── _app.login.tsx       # /
│   │   └── ...
│   │
│   ├── hooks/                    # Custom React Hooks
│   ├── services/                 # API-Aufrufe
│   ├── types/                    # TypeScript-Definitionen
│   ├── constants/                # Konstanten & Konfiguration
│   └── lib/                      # Hilfsfunktionen
│
├── prisma/                       # Datenbank
│   ├── schema.prisma             # Datenmodelle
│   └── migrations/               # Schema-Änderungen
│
├── public/                       # Statische Dateien (Bilder, PDFs)
├── scripts/                      # Hilfsskripte
└── docs/                         # Dokumentation
```

### 4.2 Architekturdiagramm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL (Hosting)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  CDN (Global)  │  Serverless Functions  │  HTTPS  │  Auto-Scaling   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Vercel Analytics & Speed Insights               │    │
│  │         (Performance Monitoring: LCP, CLS,)                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │                           FRONTEND                                  │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │     │
│  │  │   React     │  │  Tailwind   │  │    Vite     │                 │     │
│  │  │ Components  │  │    CSS      │  │   (Build)   │                 │     │
│  │  └──────┬──────┘  └─────────────┘  └─────────────┘                 │     │
│  │         │                                                           │     │
│  │  ┌──────▼──────┐                                                   │     │
│  │  │React Router │ ◄─── Loader (Daten laden)                         │     │
│  │  │   7.9.2     │ ◄─── Action (Daten senden)                        │     │
│  │  └──────┬──────┘                                                   │     │
│  └─────────┼──────────────────────────────────────────────────────────┘     │
│            │                                                                 │
│            │ HTTP Requests                                                   │
│            │                                                                 │
│  ┌─────────▼──────────────────────────────────────────────────────────┐     │
│  │                           BACKEND                                   │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │     │
│  │  │   Node.js   │  │   Prisma    │  │  Nodemailer │                 │     │
│  │  │  (Runtime)  │  │    ORM      │  │   (Email)   │                 │     │
│  │  └─────────────┘  └──────┬──────┘  └─────────────┘                 │     │
│  │                          │                                          │     │
│  └──────────────────────────┼──────────────────────────────────────────┘     │
│                             │                                                │
└─────────────────────────────┼────────────────────────────────────────────────┘
                              │
                              │ SQL Queries (SSL)
                              │
┌─────────────────────────────▼────────────────────────────────────────────────┐
│                           NEON (Cloud)                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL (Serverless)                            │   │
│  │                                                                       │   │
│  │   Users ─── Sessions ─── Courses ─── Tasks ─── Grades ─── News        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Clean Code Prinzipien

| Prinzip | Bedeutung | Umsetzung |
|---------|-----------|-----------|
| **SRP** | Eine Komponente = eine Aufgabe | Separate Dateien pro Feature |
| **DRY** | Keine Code-Wiederholung | Zentrale Konstanten & Hooks |
| **KISS** | Einfachheit bevorzugen | Kleine, verständliche Funktionen |

### 4.4 Deployment

**Vercel** hostet das MyCampus Portal mit:
- *CDN*: Inhalte werden weltweit verteilt
- *Serverless Functions*: Automatische Skalierung
- *HTTPS*: Verschlüsselte Verbindungen

---

## 5. Fazit

Das neue MyCampus Portal der IU nutzt einen modernen, wartbaren Technologie-Stack: React und Vite für schnelle Entwicklung und optimale Ladezeiten, TypeScript für Typsicherheit und weniger Fehler, Prisma und Neon PostgreSQL für zuverlässige Speicherung von Studierendendaten, sowie Vercel für einfaches Deployment mit globaler Verfügbarkeit. Diese Technologiekombination ermöglicht ein deutlich verbessertes Nutzungserlebnis gegenüber der bisherigen MyCampus-Plattform.

---

## 6. Literaturverzeichnis

- Abramov, D. & Clark, A. (2015). React: A JavaScript library for building user interfaces.
- Cardelli, L. & Wegner, P. (1985). On Understanding Types, Data Abstraction, and Polymorphism. Computing Surveys, 17(4).
- Cederholm, D. (2014). Atomic Design. Brad Frost.
- Gao, Z. et al. (2017). To Type or Not to Type: Quantifying Detectable Bugs in JavaScript. ICSE.
- Hunt, A. & Thomas, D. (2003). The Pragmatic Programmer.
- Lockley, S. W., et al. (2003). High Sensitivity of the Human Circadian Melatonin Rhythm to Short-Wavelength Light. The Journal of Clinical Endocrinology & Metabolism.
- Martin, R. C. (2008). Clean Code: A Handbook of Agile Software Craftsmanship.
- Meyer, B. (1988). Object-Oriented Software Construction.
- Provos, N. & Mazières, D. (1999). A Future-Adaptable Password Scheme. USENIX.
- Schultz, W. (2016). Dopamine reward prediction-error signalling: a hard-wired signals for learning. Nature Reviews Neuroscience.
- Stonebraker, M. & Rowe, L. (1986). The Design of POSTGRES. SIGMOD.
- Heller, E. (2004). Wie Farben wirken. Psychologie der Farbwirkung, Farbsymbolik, Farbbegriffe.
- Lidwell, W., Holden, K., & Butler, J. (2010). Universal Principles of Design.
- Sweller, J. (1988). Cognitive Load During Problem Solving: Effects on Learning. Cognitive Science.
- Tilkov, S. & Vinoski, S. (2010). Node.js: Using JavaScript to Build High-Performance Network Programs. IEEE Internet Computing.



---

*Dokumentation erstellt für das MyCampus Redesign – IU Student Portal MVP Projekt*
