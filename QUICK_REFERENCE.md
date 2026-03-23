# Quick Reference Guide

This is a quick reference for common tasks and patterns in the My Campus Redesign project.

## Common Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run typecheck
```

### Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name
```

### Testing & Quality

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit with conventional commits
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/my-feature

# Update from main
git fetch upstream
git merge upstream/main
```

## Code Snippets

### Route with Loader (Data Fetching)

```typescript
// app/routes/_app.my-route.tsx
import { json, type LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import { requireAuth } from '~/utils/protected-route';
import { prisma } from '~/lib/prisma';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireAuth(request);

  const data = await prisma.model.findMany({
    where: { userId: session.user.id }
  });

  return json({ data });
}

export default function MyRoute() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>My Route</h1>
      {data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Route with Action (Form Submission)

```typescript
// app/routes/_app.my-form.tsx
import { json, redirect, type ActionFunctionArgs } from 'react-router';
import { Form } from 'react-router';
import { requireAuth } from '~/utils/protected-route';
import { prisma } from '~/lib/prisma';

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireAuth(request);
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  await prisma.model.create({
    data: {
      title,
      description,
      userId: session.user.id
    }
  });

  return redirect('/success');
}

export default function MyForm() {
  return (
    <Form method="post">
      <input type="text" name="title" required />
      <textarea name="description" required />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Custom Hook

```typescript
// app/hooks/useMyData.ts
import { useState, useEffect } from "react";

export function useMyData(id: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/data/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  return { data, loading, error };
}
```

### Reusable Component

```typescript
// app/components/MyCard.tsx
interface MyCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function MyCard({ title, description, children, onClick }: MyCardProps) {
  return (
    <div
      className="p-4 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
```

### Context Provider

```typescript
// app/store/MyContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

### Database Query (Prisma)

```typescript
// Find one
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Find many with filters
const courses = await prisma.course.findMany({
  where: {
    majorId: majorId,
    semester: { gte: 1, lte: 6 },
  },
  include: {
    major: true,
  },
  orderBy: {
    semester: "asc",
  },
});

// Create
const newCourse = await prisma.course.create({
  data: {
    code: "CS101",
    title_de: "Informatik",
    title_en: "Computer Science",
    credits: 5,
    semester: 1,
    majorId: majorId,
  },
});

// Update
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { firstName: "John" },
});

// Delete
await prisma.course.delete({
  where: { id: courseId },
});

// Parallel queries
const [users, courses, grades] = await Promise.all([
  prisma.user.findMany(),
  prisma.course.findMany(),
  prisma.mark.findMany(),
]);
```

### API Route

```typescript
// api/routes/my-endpoint.ts
import { json } from "react-router";
import { prisma } from "../utils/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const data = await prisma.model.findUnique({
    where: { id },
  });

  if (!data) {
    return json({ error: "Not found" }, { status: 404 });
  }

  return json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();

  const created = await prisma.model.create({
    data: body,
  });

  return json({ data: created }, { status: 201 });
}
```

### Toast Notifications

```typescript
import { toast } from "~/utils/toast";

// Success
toast.success("Operation successful!");

// Error
toast.error("Something went wrong");

// Info
toast.info("Information message");

// With custom options
toast.success("Saved!", {
  position: "bottom-right",
  autoClose: 5000,
});
```

## Styling Patterns

### Responsive Grid

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

### Dark Mode Support

```typescript
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content adapts to theme
</div>
```

### Glassmorphism Effect

```typescript
<div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20">
  Glass effect
</div>
```

### Hover Effects

```typescript
<div className="transition-all hover:shadow-lg hover:scale-105">
  Hover me
</div>
```

### Loading State

```typescript
{loading ? (
  <LoadingSpinner />
) : (
  <ContentComponent data={data} />
)}
```

## Authentication Patterns

### Protected Route Loader

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireAuth(request);
  // User is authenticated
  return json({ user: session.user });
}
```

### Login Action

```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSession(user.id);

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `session=${token}; HttpOnly; Path=/; Max-Age=604800`,
      },
    },
  );
}
```

### Get Current User

```typescript
import { useAuth } from '~/hooks/useAuth';

function MyComponent() {
  const session = useAuth();

  return <div>Welcome, {session?.user.firstName}</div>;
}
```

## Common Queries

### Get User's Grades

```typescript
const grades = await prisma.mark.findMany({
  where: { userId: session.user.id },
  include: {
    course: {
      select: {
        code: true,
        title_de: true,
        title_en: true,
      },
    },
  },
  orderBy: { examDate: "desc" },
});
```

### Get Courses by Semester

```typescript
const courses = await prisma.course.findMany({
  where: {
    semester: semesterNumber,
    majorId: majorId,
  },
  include: {
    major: true,
  },
});
```

### Create Task with Due Date

```typescript
const task = await prisma.studentTask.create({
  data: {
    title: "Complete Assignment",
    description: "Submit the final project",
    dueDate: new Date("2026-03-15"),
    kind: "SUBMISSION",
    userId: session.user.id,
  },
});
```

## Debugging Tips

### Log Request Details

```typescript
console.log("Request URL:", request.url);
console.log("Request Method:", request.method);
console.log("Headers:", Object.fromEntries(request.headers));
```

### Log Database Query

```typescript
const users = await prisma.user.findMany();
console.log("Found users:", users.length);
console.log("Users:", JSON.stringify(users, null, 2));
```

### Check Environment

```typescript
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
```

### Prisma Debug Mode

```bash
# Enable query logging
DEBUG="prisma:query" npm run dev
```

## Performance Tips

### Parallel Data Fetching

```typescript
const [courses, grades, tasks] = await Promise.all([
  prisma.course.findMany(),
  prisma.mark.findMany({ where: { userId } }),
  prisma.studentTask.findMany({ where: { userId } }),
]);
```

### Memoize Expensive Calculations

```typescript
const average = useMemo(() => {
  return calculateAverage(grades);
}, [grades]);
```

### Debounce User Input

```typescript
const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Lazy Load Components

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

## Common Issues & Solutions

### Issue: Database connection errors

**Solution**: Check DATABASE_URL in .env and ensure PostgreSQL is running

### Issue: Prisma client not found

**Solution**: Run `npx prisma generate`

### Issue: Session not persisting

**Solution**: Check cookie settings and ensure HttpOnly cookies are enabled

### Issue: TypeScript errors

**Solution**: Run `npm run typecheck` and fix type issues

### Issue: Build fails

**Solution**: Clear cache and rebuild

```bash
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run build
```

## Additional Resources

- [Full Documentation Index](./DOCS_INDEX.md)
- [Code Wiki](./CODE_WIKI.md)
- [API Documentation](./my-react-router-app/docs/API.md)
- [Component Library](./my-react-router-app/docs/COMPONENTS.md)
- [Contributing Guide](./CONTRIBUTING.md)

---

Keep this guide handy for quick reference during development!
