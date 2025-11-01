## ✨ Login-Seite mit Dark/Light Mode - Professionelles Update

### 🎯 Vollständig überarbeitete Login-Seite mit modernem Design

Die neue Login-Seite (`/login`) bietet ein **professionelles**, **modernes** und **benutzerfreundliches** Erlebnis mit vollständiger **Dark Mode / Light Mode** Unterstützung.

---

## 🎨 Design-Features

### **Header mit Kontrolloptionen**
- **Logo & Branding**: IU Campus mit "Dual Degree Portal" Untertitel
- **Sprachauswahl**: Deutsch (🇩🇪) / Englisch (🇬🇧)
- **Dark Mode Toggle**: ☀️ / 🌙 Button zum Umschalten zwischen Hellem und Dunklem Modus
- **Sticky Positionierung**: Header bleibt beim Scrollen sichtbar

### **Farbschema**

**Hell Mode (Default):**
- Background: Gradient von Weiß → Blau-50 → Schiefergrau-50
- Karten: Weiße Hintergrund mit blauen Grenzen
- Text: Dunkelblau & Schiefergrau
- Inputs: Weiße Eingabefelder mit Schiefergrau-Grenze

**Dunkler Modus:**
- Background: Gradient von Schiefergrau-900 → Schiefergrau-800
- Karten: Schiefergrau-800 mit Schiefergrau-700 Grenze
- Text: Weiß & Schiefergrau-400
- Inputs: Schiefergrau-700 Eingabefelder mit Schiefergrau-600 Grenze
- Akzente: Gelbe Akzente für Dunkelmodus-Indikatoren

---

## 📱 Layout

### **Responsive 2-Spalten-Design**

**Auf Desktop (lg+):**
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]           [Sprache] [Dark/Light Mode]            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Branding & Features]  |  [Login Formular]             │
│   - Kursverwaltung      |  [Email Input]                │
│   - Nachrichten         |  [Passwort Input]             │
│   - Aufgaben            |  [Remember me & Forgot]       │
│   - Turnitin            |  [Sign In Button]             │
│                         |  [Divider]                    │
│                         |  [Sign Up]                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Auf Mobile:**
- Volle Breite
- Login Formular oben
- Features auf Link-Seite versteckt
- Kompaktes Layout

---

## 🔐 Login Formular

### **Input Felder:**
1. **E-Mail Adresse**
   - Placeholder: "student@iu-student.de"
   - Emoji Icon: ✉️
   - Validierung: E-Mail Format erforderlich

2. **Passwort**
   - Placeholder: "••••••••"
   - Emoji Icon: 🔐
   - Type: password (verschleiert)
   - Validierung: Erforderlich

### **Optionen:**
- ✅ **Remember Me Checkbox**: "Passwort merken"
- 🔗 **Forgot Password Link**: "Passwort vergessen?" → `/reset-password`

### **Buttons:**
- **Primary**: "🚀 Jetzt anmelden" (Gradient Blau)
  - Disabled beim Laden: "⏳..."
  - Hover: Skalierung (105%) + verbessertes Shadow
  - Click: Skalierung (95%)

- **Secondary**: "🔗 Jetzt registrieren" (Link in Footer)

---

## 🌐 Sprachunterstützung (DE/EN)

### **Alle Texte übersetzt:**

| Deutsch | English |
|---------|---------|
| Duales Studieren Portal | Dual Degree Student Portal |
| Deine zentrale Lernplattform... | Your central learning platform... |
| Anmelden | Login |
| E-Mail-Adresse | Email Address |
| Passwort | Password |
| Passwort merken | Remember me |
| Passwort vergessen? | Forgot password? |
| Jetzt anmelden | Sign In Now |
| Noch kein Konto? | Don't have an account? |
| Jetzt registrieren | Register Now |
| E-Mail oder Passwort ungültig | Invalid email or password |

### **Feature-Beschreibungen (DE/EN):**
- Kursverwaltung | Course Management
- Nachrichten | Messages
- Aufgabenverwaltung | Task Management
- Turnitin Integration | Turnitin Integration

---

## 🎭 Dark Mode / Light Mode

### **Automatische Anpassung:**
- Alle Farben passen sich automatisch an
- Smooth Transition (300ms)
- Text Kontrast bleibt immer optimal
- Input Felder ändern Hintergrund & Rahmen

### **Toggle-Button:**
- **Hell Mode**: Mond Icon 🌙 mit "Dark" Text
- **Dunkler Modus**: Sonne Icon ☀️ mit "Light" Text
- Button-Farbe passt sich an (Gelb im Dunkelmodus, Dunkelblau im Hellmodus)

---

## ✅ Features der Seite

### **1. Anmeldefunktion**
```javascript
- Sendet Daten an /api/login
- POST Request mit form-encoded Daten
- Credentials: include für Cookie-Handling
- Erfolgreiche Anmeldung → Toast + Redirect zu /dashboard
- Fehler → Fehlermeldung anzeigen
```

### **2. Error Handling**
- Fehlermeldung in rotem Alert-Kasten
- ⚠️ Icon mit aussagekräftigen Fehlertexten
- Toast Benachrichtigungen (via React-Toastify)
- Klare Rückmeldung bei falschen Credentials

### **3. Loading State**
- Button wird disabled während Login
- Loading Spinner Animation
- "Signing in..." Text

### **4. Branding & Features Sektion**
- 4 Feature-Boxen auf der linken Seite (Desktop)
- Icons + Beschreibungen
- Hover-Effekte
- Responsive Anpassung

---

## 🎯 Features Cards auf Link-Seite

### **Die 4 Hauptmerkmale:**

1. **📚 Kursverwaltung**
   - "Verwalte deine Kurse mit Videos, Skripten und Aufgaben"
   - Blue-tinted Background

2. **💬 Nachrichten**
   - "Kommuniziere mit Dozenten und Mitstudierenden"
   - Blue-tinted Background

3. **📋 Aufgabenverwaltung**
   - "Tracke deine Aufgaben und Fristen"
   - Blue-tinted Background

4. **🎯 Turnitin Integration**
   - "Automatische Plagiatsprüfung für Abgaben"
   - Blue-tinted Background

---

## 🚀 Technische Details

### **State Management:**
```javascript
- language: "de" | "en"
- darkMode: boolean
- email: string
- password: string
- rememberMe: boolean
- loading: boolean
- error: string
```

### **Styling Klassen:**
```javascript
- bgClass: Gradient Background basierend auf darkMode
- cardClass: Kartenart (Dark/Light)
- textClass: Textfarbe (Dark/Light)
- mutedClass: Gedimmte Textfarbe (Dark/Light)
- inputBgClass: Input-Hintergrund (Dark/Light)
```

### **Abhängigkeiten:**
- React Hooks (useState)
- React Router (useNavigate)
- React-Toastify (Benachrichtigungen)
- Tailwind CSS (Styling)

---

## 📦 Courses Seite Update

### **Neu: "Active Course" Status**

Jede Kurskarte zeigt jetzt einen Status an:

#### **Aktivierte Kurse:**
- ✅ Grünes "Aktiv" Badge mit pulsierendem Effekt
- Karte hat blauen Gradient Hintergrund
- Border: Blau-300 (hervorgehobener)

#### **Inaktive Kurse:**
- Weiße Karte ohne Badge
- Standard Border: Blau-100

### **Beispiel:**
```
┌─────────────────────────────────┐
│ WEB101  ✅ Aktiv               │ ← Grünes Badge
│ Webentwicklung                  │
│ Prof. Dr. Sarah Schmidt          │
│ 6 Credits                        │
├─────────────────────────────────┤
│ Grundlagen der modernen Web...  │
│                                 │
│ Fortschritt: 75% ████████░░    │
│ 01.10.2024 - 31.01.2025        │
│                                 │
│ [Öffnen →]                      │
└─────────────────────────────────┘
```

### **Implementierung:**
```javascript
// In courses.jsx:
{
  id: 1,
  code: "WEB101",
  title: "Webentwicklung",
  active: true,  // ← Neuer Status
  // ... rest der Daten
}

// Rendering:
{course.active && (
  <span className="...animate-pulse">
    ✅ Aktiv
  </span>
)}
```

---

## 🎓 Dual Student Experience

Die neue Login-Seite & aktualisierte Courses-Seite bieten:

✅ **Professionelles Erscheinungsbild**
✅ **Dunkler & Heller Modus**
✅ **Responsive auf allen Geräten**
✅ **Vollständig auf Deutsch & Englisch**
✅ **Aktive Kursanzeige**
✅ **Moderene Animationen & Übergänge**
✅ **Fehlerbehandlung**
✅ **Ladezustände**

---

## 🔗 Integration ins Portal

### **Navigation:**
```
Startseite (/login)
  ↓
[Anmelden]
  ↓
Dashboard (/dashboard)
  ↓
[Kurse] (/courses)
  ↓
  Aktive Kurse mit Badges ✅
  [Kursoffnen]
    ↓
    Kursdetails mit 5 Tabs
```

---

## 📊 Status

✅ **Login-Seite**: Produktionsreif, fehler frei
✅ **Dark Mode**: Vollständig implementiert
✅ **Courses Update**: Aktive Kurse angezeigt
✅ **Responsive Design**: Desktop & Mobile
✅ **Mehrsprachig**: DE/EN Support

**Alles ist bereit für den Einsatz! 🚀**
