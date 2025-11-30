# Ersti-Onboarding Feature

## Übersicht
Dieses Feature bietet neuen Studenten (Erstis) im ersten Semester eine interaktive Einführung in das IU Student Portal.

## Komponente
Die `FirstSemesterOnboarding` Komponente wurde erstellt unter:
`app/components/FirstSemesterOnboarding.tsx`

## Features
- ✅ **Automatische Erkennung**: Zeigt sich automatisch für Studenten im 1. Semester
- ✅ **4 Tutorial-Schritte**: Dashboard, Kurse, Materialien, Community
- ✅ **Video-Integration**: Möglichkeit, Tutorial-Videos einzubinden
- ✅ **Fortschrittsanzeige**: Visueller Progress-Bar
- ✅ **Lokale Speicherung**: Merkt sich, ob Onboarding abgeschlossen wurde
- ✅ **Floating Button**: Kann jederzeit erneut geöffnet werden
- ✅ **Dark Mode**: Vollständig kompatibel mit Hell/Dunkel-Modus

## Integration ins Dashboard

Um das Onboarding ins Dashboard zu integrieren, füge folgendes hinzu:

### 1. Import
```tsx
import FirstSemesterOnboarding from "~/components/FirstSemesterOnboarding";
```

### 2. Semester-Erkennung
Füge eine Funktion hinzu, um zu prüfen, ob der Student im 1. Semester ist:

```tsx
// Im Dashboard Component
const isFirstSemester = () => {
  // Beispiel: Prüfe anhand des Einschreibedatums
  // oder einer Semester-Eigenschaft des Users
  return user?.semester === 1 || user?.semester === "1";
};
```

### 3. Render
Füge die Komponente am Ende des Dashboard-Returns hinzu:

```tsx
return (
  <div>
    {/* Bestehender Dashboard-Code */}
    
    {/* Onboarding für Erstis */}
    <FirstSemesterOnboarding 
      isFirstSemester={isFirstSemester()}
      onComplete={() => console.log("Onboarding abgeschlossen")}
    />
  </div>
);
```

## Anpassungen

### Tutorial-Videos hinzufügen
Ersetze die Placeholder-URLs in `FirstSemesterOnboarding.tsx`:

```tsx
videoUrl: "https://www.youtube.com/embed/DEINE_VIDEO_ID"
```

### Schritte anpassen
Bearbeite das `ONBOARDING_STEPS` Array, um Schritte hinzuzufügen/zu entfernen:

```tsx
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Willkommen an der IU! 🎓",
    description: "...",
    icon: BookOpen,
    features: ["...", "..."],
  },
  // Weitere Schritte...
];
```

## Semester-Erkennung im Backend

Um die Semester-Information zu erhalten, erweitere das User-Model:

### 1. Prisma Schema
```prisma
model User {
  // ... bestehende Felder
  semester Int? // Aktuelles Semester
  enrollmentDate DateTime? // Einschreibedatum
}
```

### 2. Migration
```bash
npx prisma migrate dev --name add_semester_to_user
```

### 3. API Update
Füge die Semester-Info zur User-API hinzu (`app/routes/api/user.tsx`).

## Lokale Speicherung

Das Onboarding verwendet `localStorage` um zu speichern, ob es bereits gesehen wurde:
- Key: `iu_onboarding_completed`
- Zum Zurücksetzen: `localStorage.removeItem("iu_onboarding_completed")`

## Styling

Die Komponente verwendet:
- Tailwind CSS für Styling
- Lucide React für Icons
- Gradient-Hintergründe und Animationen
- Responsive Design

## Nächste Schritte

1. ✅ Komponente wurde erstellt
2. ⏳ Integration ins Dashboard (siehe Anleitung oben)
3. ⏳ Semester-Erkennung implementieren
4. ⏳ Tutorial-Videos erstellen und einbinden
5. ⏳ Testen mit echten Erstis

## Support

Bei Fragen oder Problemen:
- Prüfe die Console auf Fehler
- Stelle sicher, dass alle Imports korrekt sind
- Teste in verschiedenen Browsern
