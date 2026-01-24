# Dokumentation der MVP-Implementierung: Student Portal (IU Studium)

Dieses Dokument dient als Begleitmaterial für die Bachelorarbeit. Es dokumentiert den technischen Entwurf, die Code-Logik und den Entstehungsprozess via **Agentic Software Engineering (Vibe Coding)** für alle 14 Kernanforderungen.

---

## Methodik: Vibe Coding (Agentic Development) & Benchmarking

Der Prototyp wurde durch eine neue Form der Softwareentwicklung erstellt: **Vibe Coding**. Hierbei fungiert der Entwickler als **Software-Architekt**, der mittels natürlicher Sprache (Prompts) komplexe Systemzustände beschreibt. Die KI übernimmt die Rolle des **Implementierungs-Agenten**, der die architektonischen Vorgaben in optimierten Quellcode übersetzt.

Zusätzlich wurde ein **Benchmarking** gegen das bestehende System **IU MyCampus Classic** durchgeführt. Ziel war es, funktionale Defizite (Fragmentierung, statisches Design) zu identifizieren und im Prototyp technisch zu lösen.

---

## Implementierungskatalog nach Anforderungen

### 1. Stabile Authentifizierung & Session-Management
*   **Wissenschaftliche Erklärung:** Sicherstellung der Datenintegrität durch ein persistentes Session-System auf Basis von Prisma-Tokens in Verbindung mit HTTP-Only Cookies zur Vermeidung von Session-Abbrüchen.
*   **Prompt:** 
    > "Act as a Senior Backend Architect. Your task is to implement a robust session-based authentication system. You will:
    > - Design a database schema for persistent sessions linked to users.
    > - Write secure login/logout endpoints in `api/routes/auth.ts` that handle HTTP-only cookies to prevent XSS.
    > - Include middleware to refresh session expiry on every authenticated request to avoid login loops.
    > Rules: Use Prisma ORM for database operations and implement strict token validation."
*   **Code-Verweis:** `api/routes/auth.ts`
*   **Vorgehen:** Implementierung eines `Session`-Modells in der Datenbank und Verknüpfung mit dem `User`. Jede server-seitige Anfrage validiert den Token im Cookie.

### 2. Performance & Verfügbarkeit
*   **Wissenschaftliche Erklärung:** Optimierung der Datenbankzugriffe durch das Singleton-Entwurfsmuster und Nutzung von Server-Side Rendering (SSR) zur Minimierung der Time-to-Interactive (TTI).
*   **Prompt:**
    > "Act as a Systems Performance Engineer. Your task is to optimize the application's data layer. You will:
    > - Create a singleton Prisma client in `app/lib/prisma.ts` to prevent connection overhead.
    > - Implement error boundaries in `app/root.tsx` to handle system downtime gracefully.
    > Rules: Focus on high availability and minimal latency."
*   **Code-Verweis:** `app/lib/prisma.ts`

### 3. Globale Suchfunktion
*   **Wissenschaftliche Erklärung:** Implementierung einer zentralen Such-Logik, die Navigations-Metadaten und Kursinhalte indiziert, um die Informationsauffindbarkeit zu maximieren.
*   **Prompt:**
    > "Act as a Frontend UX Engineer. Your task is to create a high-performance global search hook. You will:
    > - Design a filter logic in `app/hooks/useAppShellSearch.ts` that searches through nested navigation constants.
    > - Write a reactive hook that updates results in real-time.
    > Rules: Ensure O(n) search performance and clean UI separation."
*   **Code-Verweis:** `app/hooks/useAppShellSearch.ts`

### 4. Navigation (Klare Menüstruktur)
*   **Wissenschaftliche Erklärung:** Reduktion der kognitiven Last durch eine flache Informationsarchitektur mit einer Klicktiefe von maximal zwei Ebenen.
*   **Prompt:**
    > "Act as an Information Architect. Your task is to design a flat navigation structure. You will:
    > - Define a central route configuration in `app/routes.ts`.
    > - Create a persistent sidebar component that provides instant access to core functions.
    > Rules: Maximize usability and minimize click path length."
*   **Code-Verweis:** `app/routes.ts` / `app/components/shell/Sidebar.tsx`

### 5. Personalisierbares Dashboard
*   **Wissenschaftliche Erklärung:** Aggregation nutzerspezifischer Datenpunkte in einer modularen Widget-Übersicht für eine individuelle Startseiten-Erfahrung.
*   **Prompt:**
    > "Act as a UI Designer. Your task is to build a personalized dashboard. You will:
    > - Create modular widgets for grades, tasks, and schedules in `app/routes/_app.dashboard.tsx`.
    > - Design a layout that adapts to the user's specific study program.
    > Rules: Use a clean, professional aesthetic with informative cards."
*   **Code-Verweis:** `app/routes/_app.dashboard.tsx`

### 6. Favoriten & Verlauf
*   **Wissenschaftliche Erklärung:** Implementierung eines Persistenz-Mechanismus für Nutzerinteraktionen zur schnelleren Wiederauffindbarkeit von Inhalten.
*   **Prompt:**
    > "Act as a Frontend Developer. Your task is to implement a 'Recent History' feature. You will:
    > - Write a utility to log visited courses in LocalStorage via `app/lib/recentCourses.ts`.
    > - Design a 'Recently Viewed' widget for the dashboard shell.
    > Rules: Keep it lightweight and privacy-conscious."
*   **Code-Verweis:** `app/lib/recentCourses.ts`

### 7. Zuverlässige Notenverwaltung
*   **Wissenschaftliche Erklärung:** Korrekte Aggregation und grafische Aufbereitung von Prüfungsdaten direkt aus der relationalen Datenbank.
*   **Prompt:**
    > "Act as a Data Engineer. Your task is to build a reliable grade overview. You will:
    > - Design a view in `app/routes/_app.notenverwaltung.tsx` that fetches live Prisma data.
    > - Include filters for semesters and study types.
    > Rules: Ensure data accuracy and provide a clear visual summary."
*   **Code-Verweis:** `app/routes/_app.notenverwaltung.tsx`

### 8. Kommunikation (Support-Anfragen)
*   **Wissenschaftliche Erklärung:** Automatisierung des Support-Prozesses durch integrierte API-Endpunkte und SMTP-Anbindung.
*   **Prompt:**
    > "Act as a Backend Developer. Your task is to implement a support messaging system. You will:
    > - Create an API route in `app/routes/api/contact.submit.tsx` for form submissions.
    > - Integrate Nodemailer for automated email notifications.
    > Rules: Validate all inputs and ensure secure data handling."
*   **Code-Verweis:** `app/routes/api/contact.submit.tsx`

### 9. Barrierefreiheit
*   **Wissenschaftliche Erklärung:** Umsetzung assistiver Technologien durch globale Context-Provider zur Unterstützung von Screenreadern und Tastaturnavigation.
*   **Prompt:**
    > "Act as an Accessibility Specialist. Your task is to implement an A11y layer. You will:
    > - Design a `ScreenReaderProvider` in `app/contexts/ScreenReaderContext.tsx`.
    > - Ensure high-contrast colors and high-legibility fonts.
    > Rules: Adhere to WCAG 2.1 accessibility guidelines."
*   **Code-Verweis:** `app/contexts/ScreenReaderContext.tsx`

### 10. Responsives Design (Mobile-First)
*   **Wissenschaftliche Erklärung:** Umsetzung eines adaptiven Layout-Systems, das volle Funktionalität auf allen Endgeräte-Klassen garantiert.
*   **Prompt:**
    > "Act as a Mobile-First Designer. Your task is to ensure full responsiveness. You will:
    > - Use Tailwind CSS breakpoints in `app/routes/_app.tsx` for adaptive layouts.
    > - Implement a burger-menu for smaller viewports.
    > Rules: Design for mobile users as the primary audience."
*   **Code-Verweis:** `app/routes/_app.tsx`

### 11. UI-Design & Dark Mode
*   **Wissenschaftliche Erklärung:** Implementierung eines dynamischen Theming-Systems auf Basis von HSL-CSS-Variablen für verbesserte Lesbarkeit und Nutzerkomfort.
*   **Prompt:**
    > "Act as a Professional Web Designer. Your task is to create a premium Dark Mode. You will:
    > - Implement a `ThemeContext.tsx` for global theme switching.
    > - Design high-contrast color schemes for dark mode.
    > Rules: Ensure a modern, state-of-the-art aesthetic with smooth transitions."
*   **Code-Verweis:** `app/contexts/ThemeContext.tsx`

### 12. Klare Systemrückmeldungen
*   **Wissenschaftliche Erklärung:** Reduktion von Nutzerunsicherheiten durch explizite visuelle Rückmeldungen zu jedem Systemereignis.
*   **Prompt:**
    > "Act as a UX Interaction Designer. Your task is to standardize system feedback. You will:
    > - Integrate `react-toastify` for global notifications in `app/lib/toast.ts`.
    > - Map all server responses to meaningful user messages.
    > Rules: Use color-coded alerts (Success, Error, Info) for clarity."
*   **Code-Verweis:** `app/lib/toast.ts`

### 13. Erweiterungen (Mobile App / PWA)
*   **Wissenschaftliche Erklärung:** Vorbereitung der App-Architektur für eine native Installation und Offline-Fähigkeit durch Service-Worker-Unterstützung.
*   **Prompt:**
    > "Act as a Mobile App Architect. Your task is to prepare the project for PWA functionality. You will:
    > - Design a shell that works as a standalone web app.
    > - Configure the head metadata in `root.tsx` for mobile installation.
    > Rules: Ensure the application feels like a native app when saved to the home screen."
*   **Code-Verweis:** `app/root.tsx` (Head-Metadaten)

### 14. Innovation (KI-Lernassistent)
*   **Wissenschaftliche Erklärung:** Prototypische Integration generativer KI-Schnittstellen zur Unterstützung personalisierter Lernpfade.
*   **Prompt:**
    > "Act as an AI Product Designer. Your task is to create a futuristic AI Assistant. You will:
    > - Build the `_app.lernassistent.tsx` route with an interactive chat interface.
    > - Integrate learning widgets that provide intelligent study insights.
    > Rules: Emphasize the unique selling point of AI-supported education."
*   **Code-Verweis:** `app/routes/_app.lernassistent.tsx`

---

## Umsetzung: Farben & Design-System
Die visuelle Sprache des MVP nutzt ein **Icy Blue & Dark Navy** Farbschema, um Professionalität zu vermitteln, kombiniert mit **Glassmorphismus-Effekten** (Background Blur) für ein modernes, hochwertiges Gefühl.

*   **Primärfarbe:** `#111f60` (IU Branding)
*   **Akzent:** `#3B82F6` (Action Blue)
*   **Hintergrund:** Variable HSL-Werte für dynamische Kontrastanpassung.

---

## Vergleich: Prototyp vs. IU MyCampus Classic (Benchmarking)

Um die Innovationshöhe der Arbeit zu belegen, wurden zentrale Module des Prototyps mit den bestehenden Lösungen der IU verglichen:

| Bereich | IU MyCampus Classic (Bestand) | Prototyp (Neue Implementierung) | Wissenschaftlicher Vorteil |
| :--- | :--- | :--- | :--- |
| **Architektur** | Monolithisches Legacy-System | Hybride SPA (React Router v7 + Express) | Höhere Skalierbarkeit & TTI (Time to Interactive) |
| **User Interface**| Statisches Weiß-Grau Design | Glassmorphism & Dynamic Dark Mode | Reduktion von "Screen Fatigue" |
| **Suche** | Hierarchische Klickpfade | Globales Omni-Search Hook System | Massive Reduktion der Time-to-Information |
| **Noten** | Tabellarische Darstellung | Reaktive Ansicht mit Data-Loadern | Echtzeit-Synchronisation & State Management |
| **Infrastruktur** | Fragmentierte Portale | Unified Student Experience (All-in-One) | Minimierung von Medienbrüchen |

---

## Fortgeschrittene Software-Architektur Deep-Dives

### 1. Modernes Data Loading
Anstatt instabile Seitenaufrufe oder Client-side Fetching (useEffect) zu nutzen, implementiert der Prototyp das **Server-Side Data Loading** von React Router v7. Daten werden bereits beim Routing-Prozess geladen, was "Layout Shifts" verhindert.
*   **Datei:** `app/routes/` (Alle Loader-Funktionen)

### 2. Relationales Schema-Design
Das Datenmodell in `prisma/schema.prisma` nutzt strikte relationale Integrität. Ein `User` ist über Fremdschlüssel sicher mit `Sessions`, `Grades` und `Tasks` verknüpft, was Inkonsistenzen (Datenmüll) ausschließt – ein kritischer Faktor bei großen Studierendenzahlen.
*   **Datei:** `prisma/schema.prisma`

### 3. Separation of Concerns (Hybrides Backend)
Durch die Trennung von **Express (System-Logik)** und **React Router (UI-Logik)** wird eine saubere Software-Architektur gewährleistet. Dies ermöglicht es, Backend-Tasks (wie den `cron.ts` Mail-Versand) unabhängig von der Front-End Performance zu skalieren.

---

*Erstellt im Rahmen der Implementierungs-Dokumentation für die Bachelorarbeit 2026. Fokus: Re-Engineering realer Hochschulportale.*
