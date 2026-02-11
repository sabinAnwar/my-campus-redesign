# My Campus Redesign - Code Wiki

Welcome to the comprehensive code documentation for the My Campus Redesign project. This wiki provides detailed technical information about the codebase architecture, patterns, and implementation details.

## 📖 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Core Concepts](#core-concepts)
4. [Authentication System](#authentication-system)
5. [Database Schema](#database-schema)
6. [Routing & Navigation](#routing--navigation)
7. [Component Architecture](#component-architecture)
8. [State Management](#state-management)
9. [API Endpoints](#api-endpoints)
10. [Utilities & Hooks](#utilities--hooks)
11. [Styling & Theming](#styling--theming)
12. [Testing Strategy](#testing-strategy)
13. [Deployment](#deployment)
14. [Development Guidelines](#development-guidelines)

---

## Architecture Overview

### Technology Stack

```
┌─────────────────────────────────────────┐
│         React Router v7 (SSR)           │
│  ┌─────────────┐      ┌──────────────┐ │
│  │   React 19  │      │  TypeScript  │ │
│  └─────────────┘      └──────────────┘ │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         Node.js Backend Layer           │
│  ┌─────────────┐      ┌──────────────┐ │
│  │  Express.js │      │  Prisma ORM  │ │
│  └─────────────┘      └──────────────┘ │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│         PostgreSQL Database             │
└─────────────────────────────────────────┘
```

### Design Patterns

- **Server-Side Rendering (SSR)**: Pages are rendered on the server for optimal performance
- **Data Loader Pattern**: React Router loaders fetch data before rendering
- **Singleton Pattern**: Prisma client is instantiated once and reused
- **Context Pattern**: Theme, language, and accessibility states use React Context
- **Feature-Based Architecture**: Code organized by features, not by file type
- **Repository Pattern**: Database operations abstracted through Prisma

---

## Directory Structure

```
my-react-router-app/
├── app/
│   ├── routes/              # Route handlers (pages)
│   │   ├── _app.tsx         # Main layout wrapper
│   │   ├── _app.dashboard.tsx
│   │   ├── _app.courses.tsx
│   │   └── ...
│   ├── features/            # Feature modules (30+)
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── courses/         # Course components
│   │   ├── settings/        # User settings
│   │   └── ...
│   ├── components/          # Shared components
│   │   └── ui/              # Base UI components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Server-side services
│   │   ├── auth.server.ts
│   │   ├── email.server.ts
│   │   └── ...
│   ├── store/               # Context providers
│   │   ├── ThemeContext.tsx
│   │   ├── LanguageContext.tsx
│   │   └── ScreenReaderContext.tsx
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   ├── data/                # Static data
│   ├── config/              # Configuration
│   └── root.tsx             # App root
├── api/
│   ├── routes/              # API endpoints
│   └── utils/               # API utilities
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.js              # Database seeding
├── public/                  # Static assets
├── docs/                    # Documentation
└── tests/                   # Test files
```

---

## Core Concepts

### 1. React Router v7 Patterns

#### Route Files
Routes in the `app/routes/` directory automatically map to URLs:

```typescript
// app/routes/_app.dashboard.tsx
export async function loader({ request }: LoaderFunctionArgs) {
  // Fetch data on server before rendering
  const session = await getUserFromRequest(request);
  const tasks = await prisma.studentTask.findMany({
    where: { userId: session.user.id }
  });
  return json({ tasks });
}

export default function Dashboard() {
  const { tasks } = useLoaderData<typeof loader>();
  return <div>Dashboard with {tasks.length} tasks</div>;
}
```

#### Nested Layouts
The `_app.tsx` layout wraps all protected routes:

```typescript
// app/routes/_app.tsx
export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

### 2. Server-Side Data Loading

**Loaders** run on the server and provide data to components:

```typescript
export async function loader({ request, params }: LoaderFunctionArgs) {
  // Always check authentication first
  const session = await requireAuth(request);
  
  // Fetch data in parallel for performance
  const [courses, grades, schedule] = await Promise.all([
    prisma.course.findMany(),
    prisma.mark.findMany({ where: { userId: session.user.id } }),
    prisma.scheduleEvent.findMany({ where: { userId: session.user.id } })
  ]);
  
  return json({ courses, grades, schedule });
}
```

### 3. Feature-Based Organization

Each feature is self-contained with its components, types, and utilities:

```
features/
├── courses/
│   ├── CourseCard.tsx
│   ├── CourseDetail.tsx
│   ├── CourseFilters.tsx
│   └── types.ts
├── dashboard/
│   ├── GradesWidget.tsx
│   ├── TasksWidget.tsx
│   └── NewsWidget.tsx
```

---

## Authentication System

### Overview

The authentication system uses **token-based sessions** stored in the database with HTTP-only cookies for security.

### Components

1. **Session Model** (Prisma)
```prisma
model Session {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

2. **Authentication Service** (`app/services/auth.server.ts`)
```typescript
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await prisma.session.create({
    data: { token, userId, expiresAt }
  });
  
  return token;
}

export async function getUserFromRequest(request: Request) {
  const token = getSessionToken(request);
  if (!token) return null;
  
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  
  if (!session || new Date() > session.expiresAt) {
    return null;
  }
  
  return session;
}
```

3. **Login Flow**
```typescript
// app/routes/api.login.tsx
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  
  const user = await prisma.user.findUnique({
    where: { username }
  });
  
  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
  
  const token = await createSession(user.id);
  
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `session=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`
      }
    }
  );
}
```

### Protected Routes

```typescript
// app/utils/protected-route.ts
export async function requireAuth(request: Request) {
  const session = await getUserFromRequest(request);
  if (!session) {
    throw redirect("/login");
  }
  return session;
}

// Usage in route loader
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireAuth(request);
  // User is authenticated, proceed with data loading
  return json({ user: session.user });
}
```

### Password Reset Flow

1. User requests reset → Email sent with token
2. Token stored in database with expiration
3. User clicks link with token
4. Token validated → New password set
5. Token deleted

---

## Database Schema

### Core Models

#### User Model
```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  username          String?   @unique
  password          String
  firstName         String?
  lastName          String?
  studentId         String?   @unique
  semester          Int       @default(1)
  majorId           String?
  major             Major?    @relation(fields: [majorId], references: [id])
  role              Role      @default(STUDENT)
  
  // Relations
  sessions          Session[]
  marks             Mark[]
  files             File[]
  tasks             StudentTask[]
  forumPosts        ForumPost[]
  roomBookings      RoomBooking[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### Course Model
```prisma
model Course {
  id              String   @id @default(uuid())
  code            String   @unique
  title_de        String
  title_en        String
  credits         Int
  semester        Int
  description_de  String?
  description_en  String?
  majorId         String
  major           Major    @relation(fields: [majorId], references: [id])
  
  marks           Mark[]
  forumTopics     ForumTopic[]
  
  createdAt       DateTime @default(now())
}
```

#### Mark Model (Grades)
```prisma
model Mark {
  id          String   @id @default(uuid())
  value       Float    // Grade value (e.g., 2.3)
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  teacher     String?
  examDate    DateTime?
  credits     Int
  semester    Int
  
  createdAt   DateTime @default(now())
}
```

### Academic Models

#### StudentTask
```prisma
model StudentTask {
  id          String       @id @default(uuid())
  title       String
  description String?
  dueDate     DateTime
  kind        TaskKind     // SUBMISSION or EXAM
  status      TaskStatus   @default(PENDING)
  courseId    String?
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  
  createdAt   DateTime     @default(now())
}
```

#### ScheduleEvent
```prisma
model ScheduleEvent {
  id          String       @id @default(uuid())
  title       String
  startTime   DateTime
  endTime     DateTime
  eventType   EventType    // LECTURE, EXAM, SEMINAR
  location    String?
  courseId    String?
  userId      String
  
  createdAt   DateTime     @default(now())
}
```

### Engagement Models

#### News
```prisma
model News {
  id           String    @id @default(uuid())
  title_de     String
  title_en     String
  content_de   String
  content_en   String
  imageUrl     String?
  category     String
  featured     Boolean   @default(false)
  publishedAt  DateTime  @default(now())
}
```

#### ForumTopic & ForumPost
```prisma
model ForumTopic {
  id          String      @id @default(uuid())
  title       String
  courseId    String?
  course      Course?     @relation(fields: [courseId], references: [id])
  pinned      Boolean     @default(false)
  likes       Int         @default(0)
  posts       ForumPost[]
  
  createdAt   DateTime    @default(now())
}

model ForumPost {
  id          String      @id @default(uuid())
  content     String
  topicId     String
  topic       ForumTopic  @relation(fields: [topicId], references: [id], onDelete: Cascade)
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  likes       Int         @default(0)
  
  createdAt   DateTime    @default(now())
}
```

### Relationships

- **User → Session**: One-to-many (cascade delete)
- **User → Mark**: One-to-many
- **User → Task**: One-to-many
- **Course → Mark**: One-to-many
- **Major → Course**: One-to-many
- **ForumTopic → ForumPost**: One-to-many (cascade delete)

---

## Routing & Navigation

### Route Structure

```
/                          → Login page (public)
/login                     → Login form
/logout                    → Logout action
/reset-password            → Password reset request
/reset-password/:token     → Password reset form

/_app                      → Protected layout (requires auth)
  /dashboard               → Main dashboard
  /courses                 → Course list
  /courses/:courseId       → Course detail
  /exams                   → Exam management
  /notenverwaltung         → Grade overview
  /certificates            → Certificates & documents
  /news                    → News feed
  /news/:slug              → News detail
  /library                 → Library resources
  /praxisbericht2          → Practical reports
  /room-booking            → Room booking
  /settings                → User settings
  /faq                     → Help & FAQ
  /contact                 → Contact form
```

### Navigation Configuration

```typescript
// app/config/navigation.ts
export const BASE_NAV_ITEMS = [
  {
    to: "/dashboard",
    key: "dashboard",
    icon: Home,
    label_de: "Dashboard",
    label_en: "Dashboard"
  },
  {
    to: "/courses",
    key: "courses",
    icon: BookOpen,
    label_de: "Kurse",
    label_en: "Courses"
  },
  // ... more items
];
```

### Global Search

The search system indexes all navigation items and course metadata:

```typescript
// app/hooks/useAppShellSearch.ts
export function useAppShellSearch(query: string) {
  const { language } = useLanguage();
  
  const searchableData = useMemo(() => [
    ...BASE_NAV_ITEMS.map(item => ({
      title: language === 'de' ? item.label_de : item.label_en,
      path: item.to,
      type: 'navigation'
    })),
    ...courses.map(course => ({
      title: language === 'de' ? course.title_de : course.title_en,
      path: `/courses/${course.id}`,
      type: 'course'
    }))
  ], [language]);
  
  return searchableData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}
```

---

## Component Architecture

### Layout Components

#### AppShell (`app/routes/_app.tsx`)
The main application shell with:
- Sidebar navigation
- Top search bar
- Profile menu
- Theme toggle
- Outlet for child routes

```typescript
export default function AppLayout() {
  const session = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <SearchBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

#### Sidebar (`app/layouts/shell/Sidebar.tsx`)
```typescript
export function Sidebar() {
  const { language } = useLanguage();
  
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card">
      <nav>
        {BASE_NAV_ITEMS.map(item => (
          <NavLink key={item.key} to={item.to}>
            <item.icon />
            {language === 'de' ? item.label_de : item.label_en}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

### Feature Components

Feature components are organized by domain and follow consistent patterns:

#### Widget Pattern (Dashboard)
```typescript
// features/dashboard/GradesWidget.tsx
export function GradesWidget({ grades }: { grades: Mark[] }) {
  const average = calculateAverage(grades);
  
  return (
    <div className="widget">
      <h3>Grade Overview</h3>
      <div className="text-4xl font-bold">{average.toFixed(2)}</div>
      <p>{grades.length} courses completed</p>
    </div>
  );
}
```

#### Card Pattern (Courses)
```typescript
// features/courses/CourseCard.tsx
export function CourseCard({ course }: { course: Course }) {
  return (
    <Link to={`/courses/${course.id}`}>
      <div className="card hover:shadow-lg transition">
        <h4>{course.title}</h4>
        <p>{course.credits} ECTS</p>
        <span className="badge">Semester {course.semester}</span>
      </div>
    </Link>
  );
}
```

### Shared UI Components

#### PageHeader
```typescript
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
```

---

## State Management

### Context Providers

#### Theme Context
```typescript
// app/store/ThemeContext.tsx
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

#### Language Context
```typescript
// app/store/LanguageContext.tsx
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

#### Screen Reader Context
```typescript
// app/store/ScreenReaderContext.tsx
export function ScreenReaderProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  
  return (
    <ScreenReaderContext.Provider value={{ isEnabled, setIsEnabled }}>
      {children}
    </ScreenReaderContext.Provider>
  );
}
```

### Local Storage Hooks

```typescript
// app/hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  
  return [storedValue, setValue] as const;
}
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/login
```typescript
// Request
{
  "username": "student@example.com",
  "password": "password123"
}

// Response (Success)
{
  "success": true
}
// Sets HTTP-only cookie: session=<token>

// Response (Error)
{
  "error": "Invalid credentials"
}
```

#### POST /api/logout
```typescript
// Deletes session from database and clears cookie
// Response
{
  "success": true
}
```

#### POST /api/request-password-reset
```typescript
// Request
{
  "email": "student@example.com"
}

// Response
{
  "message": "If account exists, reset email sent"
}
```

### Data Endpoints

#### GET /api/courses
```typescript
// Query params: ?majorId=uuid&semester=1
// Response
{
  "courses": [
    {
      "id": "uuid",
      "code": "DLBWPGES01",
      "title_de": "Geschichte",
      "title_en": "History",
      "credits": 5,
      "semester": 1
    }
  ]
}
```

#### GET /api/news
```typescript
// Query params: ?category=campus&featured=true
// Response
{
  "news": [
    {
      "id": "uuid",
      "title_de": "News Title",
      "content_de": "Content...",
      "imageUrl": "/uploads/image.jpg",
      "publishedAt": "2026-01-15T10:00:00Z"
    }
  ]
}
```

#### GET /api/grades
```typescript
// Requires authentication
// Response
{
  "grades": [
    {
      "id": "uuid",
      "value": 1.7,
      "course": {
        "code": "DLBWPGES01",
        "title_de": "Geschichte"
      },
      "credits": 5,
      "examDate": "2025-12-10T09:00:00Z"
    }
  ],
  "average": 2.1
}
```

### Action Endpoints

#### POST /api/forum/topics/:topicId/posts
```typescript
// Request
{
  "content": "My forum post content"
}

// Response
{
  "post": {
    "id": "uuid",
    "content": "My forum post content",
    "createdAt": "2026-02-11T17:00:00Z"
  }
}
```

#### POST /api/room-bookings
```typescript
// Request
{
  "date": "2026-02-15",
  "startTime": "10:00",
  "endTime": "12:00",
  "campus": "Berlin",
  "roomNumber": "B201"
}

// Response
{
  "booking": {
    "id": "uuid",
    "date": "2026-02-15",
    "startTime": "10:00:00",
    "endTime": "12:00:00"
  }
}
```

---

## Utilities & Hooks

### Custom Hooks

#### useAuth
```typescript
export function useAuth() {
  const data = useRouteLoaderData('root');
  return data?.session ?? null;
}
```

#### useDebounce
```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

#### useClickOutside
```typescript
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
}
```

### Utility Functions

#### Date Utilities
```typescript
// app/utils/dateUtils.ts
export function formatDate(date: Date, locale: string = 'de-DE'): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
```

#### Grade Calculations
```typescript
// app/utils/gradeUtils.ts
export function calculateAverage(marks: Mark[]): number {
  if (marks.length === 0) return 0;
  
  const totalWeightedGrade = marks.reduce(
    (sum, mark) => sum + mark.value * mark.credits,
    0
  );
  const totalCredits = marks.reduce((sum, mark) => sum + mark.credits, 0);
  
  return totalWeightedGrade / totalCredits;
}

export function getGradeColor(grade: number): string {
  if (grade <= 2.0) return 'text-green-600';
  if (grade <= 3.0) return 'text-yellow-600';
  return 'text-red-600';
}
```

#### Toast Notifications
```typescript
// app/utils/toast.ts
import { toast as reactToastify } from 'react-toastify';

export const toast = {
  success: (message: string) => {
    reactToastify.success(message, {
      position: 'top-right',
      autoClose: 3000
    });
  },
  
  error: (message: string) => {
    reactToastify.error(message, {
      position: 'top-right',
      autoClose: 5000
    });
  },
  
  info: (message: string) => {
    reactToastify.info(message, {
      position: 'top-right',
      autoClose: 3000
    });
  }
};
```

---

## Styling & Theming

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#111f60',
        accent: '#3B82F6',
        
        // Semantic colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
      },
    },
  },
};
```

### CSS Variables

```css
/* app/styles/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 222 47% 15%;
  --card-foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
}
```

### Glassmorphism Effects

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## Testing Strategy

### Unit Testing

```typescript
// tests/utils/gradeUtils.test.ts
import { calculateAverage } from '../app/utils/gradeUtils';

describe('calculateAverage', () => {
  it('calculates weighted average correctly', () => {
    const marks = [
      { value: 1.7, credits: 5 },
      { value: 2.3, credits: 5 },
    ];
    expect(calculateAverage(marks)).toBe(2.0);
  });
  
  it('returns 0 for empty array', () => {
    expect(calculateAverage([])).toBe(0);
  });
});
```

### Integration Testing

```typescript
// tests/routes/login.test.ts
import { createRemixStub } from '@remix-run/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../app/routes/login';

describe('Login Page', () => {
  it('submits login form', async () => {
    const RemixStub = createRemixStub([
      { path: '/login', Component: Login }
    ]);
    
    render(<RemixStub initialEntries={['/login']} />);
    
    await userEvent.type(screen.getByLabelText('Username'), 'testuser');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });
});
```

---

## Deployment

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mycampus"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Session
SESSION_SECRET="your-secret-key-here"

# Application
NODE_ENV="production"
PORT=3000
```

### Build Process

```bash
# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# The build output will be in build/
```

### Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install && npx prisma generate",
  "framework": null,
  "outputDirectory": "build"
}
```

---

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserSession`, `CourseData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### File Organization

```
feature-name/
├── FeatureComponent.tsx      # Main component
├── FeatureCard.tsx            # Sub-component
├── useFeatureLogic.ts         # Custom hook
├── types.ts                   # Type definitions
└── utils.ts                   # Utility functions
```

### Git Commit Messages

Follow conventional commits:
```
feat: add user profile page
fix: resolve session timeout issue
docs: update API documentation
style: format code with prettier
refactor: simplify grade calculation
test: add tests for auth service
chore: update dependencies
```

### Performance Best Practices

1. **Use loaders for data fetching** (SSR)
2. **Parallelize database queries** (`Promise.all`)
3. **Memoize expensive calculations** (`useMemo`)
4. **Debounce user input** (search, filters)
5. **Lazy load images** (loading="lazy")
6. **Code splitting** (dynamic imports)

### Accessibility Guidelines

1. **Semantic HTML** (use proper tags)
2. **ARIA labels** for interactive elements
3. **Keyboard navigation** support
4. **Focus management** (trap focus in modals)
5. **Color contrast** (WCAG AAA compliance)
6. **Screen reader** testing

---

## Additional Resources

- [React Router v7 Documentation](https://reactrouter.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: February 2026

For questions or contributions, please refer to the [Contributing Guide](./CONTRIBUTING.md) or open an issue on GitHub.
