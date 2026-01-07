<div style="font-family: Calibri, 'Segoe UI', Arial, sans-serif;">

# Anforderungen – Code-Snippets (Beispiele)

## 1) Stabile Authentifizierung & Session-Management (MUSS)
```ts
const session = await prisma.session.findUnique({ where: { token: sessionToken } });
if (!session || new Date() > session.expiresAt) return null;
```

## 2) Performance & Verfuegbarkeit (MUSS)
```ts
const [tasks, partner, target] = await Promise.all([
  prisma.studentTask.findMany(...),
  prisma.praxisPartner.findUnique(...),
  prisma.praxisHoursTarget.findUnique(...),
]);
```

## 3) Globale Suche (MUSS)
```ts
const searchableData = useMemo(() => [...courseItems, ...staticItems], []);
const filteredResults = searchableData.filter(item =>
  item.title.toLowerCase().includes(query)
);
```

## 4) Navigation & geringe Klicktiefe (MUSS)
```ts
export const BASE_NAV_ITEMS = [
  { to: "/dashboard", key: "dashboard", icon: Home },
  { to: "/courses", key: "courses", icon: BookOpen },
  ...
];
```

## 5) Personalisierbares Dashboard (SOLL)
```ts
const userId = session.user.id;
const tasks = await prisma.studentTask.findMany({ where: { userId } });
```

## 6) Favoriten & Verlauf (SOLL)
```ts
localStorage.setItem("recentFilesList", JSON.stringify(next));
```

## 7) Zuverlaessige Notenverwaltung (MUSS)
```ts
const dbUser = await prisma.user.findUnique({
  include: { marks: { include: { teacher: true } } },
});
```

## 8) Benachrichtigungen & Austausch (SOLL)
```ts
await prisma.user.update({
  where: { id: user.id },
  data: { reminderEnabled: enabled, reminderHour: hour, reminderMinute: minute },
});
```

## 9) Barrierefreiheit (MUSS)
```ts
const { isEnabled, speak } = useScreenReaderSafe();
if (isEnabled) speak(text);
```

## 10) Mobile-First / Responsive (MUSS)
```ts
const isMobile = window.innerWidth < 768;
if (isMobile) onClose();
```

## 11) Konsistentes UI + Dark Mode (SOLL)
```ts
root.classList.remove("light", "dark");
root.classList.add(theme);
```

## 12) Systemtransparenz / Rueckmeldungen (MUSS)
```ts
const [savedStatus, setSavedStatus] = useState(loadSavedStatus());
localStorage.setItem("submissionStatus", JSON.stringify(next));
```

## 13) Dedizierte mobile App (KANN)
Kein Code-Snippet vorhanden (nicht implementiert).

## 14) KI-gestuetzte Funktionen (KANN)
```ts
const response = await fetch(url, { method: "POST", body: JSON.stringify(...) });
return data.candidates[0].content.parts[0].text;
```
</div>
