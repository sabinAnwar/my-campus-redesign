# Architecture Documentation

## System Architecture Overview

The My Campus Redesign application follows a modern **hybrid SSR (Server-Side Rendering) architecture** using React Router v7, combining the benefits of server-side rendering with client-side interactivity.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Browser                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         React 19 Application                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │  Routes  │  │Components│  │  Context/State   │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│              React Router v7 Server (Node.js)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Route Handlers (Loaders & Actions)                 │   │
│  │  ┌──────────────┐  ┌───────────────────────────┐   │   │
│  │  │   Loaders    │  │       Actions             │   │   │
│  │  │  (GET data)  │  │  (POST/PUT/DELETE data)   │   │   │
│  │  └──────────────┘  └───────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Services Layer                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │   Auth   │  │  Email   │  │  File Processing │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Prisma ORM Client                         │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ TCP/IP
                         │
┌────────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tables: users, sessions, courses, marks, etc.      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology**: React 19, TypeScript, Tailwind CSS

**Responsibilities**:
- Render UI components
- Handle user interactions
- Manage client-side state (theme, language)
- Execute client-side navigation
- Display data from loaders

**Key Components**:
- **Routes**: Page-level components in `app/routes/`
- **Features**: Domain-specific UI in `app/features/`
- **Layouts**: Shell components (Sidebar, SearchBar)
- **Contexts**: Global state providers (Theme, Language, ScreenReader)

### 2. Application Layer (React Router)

**Technology**: React Router v7 (SSR)

**Responsibilities**:
- Route matching and rendering
- Server-side data loading (loaders)
- Form submissions and mutations (actions)
- Session management
- Error boundaries

**Key Concepts**:

#### Loaders (Server-Side Data Fetching)
```typescript
export async function loader({ request, params }: LoaderFunctionArgs) {
  // Runs on server before rendering
  const session = await requireAuth(request);
  const data = await fetchData(params.id);
  return json({ data });
}
```

#### Actions (Server-Side Mutations)
```typescript
export async function action({ request }: ActionFunctionArgs) {
  // Runs on server for form submissions
  const formData = await request.formData();
  await saveData(formData);
  return redirect('/success');
}
```

### 3. Business Logic Layer (Services)

**Technology**: Node.js, TypeScript

**Responsibilities**:
- Authentication and authorization
- Email notifications
- PDF generation and processing
- File upload handling
- Complex business rules

**Key Services**:
- `auth.server.ts`: Session creation, validation, password hashing
- `email.server.ts`: Email sending via Nodemailer
- `pdf.server.ts`: PDF generation with jsPDF
- `file-processing.ts`: File upload and validation

### 4. Data Access Layer (Prisma ORM)

**Technology**: Prisma ORM

**Responsibilities**:
- Database connection management
- Query generation and execution
- Type-safe database operations
- Migrations and schema management

**Key Patterns**:

#### Singleton Pattern
```typescript
// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
```

#### Repository Pattern
```typescript
// app/services/user.repository.ts
export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  
  async create(data: CreateUserInput) {
    return prisma.user.create({ data });
  }
  
  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({ where: { id }, data });
  }
}
```

### 5. Database Layer

**Technology**: PostgreSQL

**Responsibilities**:
- Data persistence
- Data integrity and constraints
- Indexing and query optimization
- Backup and recovery

## Design Patterns

### 1. Server-Side Rendering (SSR) Pattern

**Problem**: Traditional SPAs have slow initial load times and poor SEO.

**Solution**: Render pages on the server and send complete HTML to the client.

**Implementation**:
```typescript
// Server renders the page
export async function loader({ request }: LoaderFunctionArgs) {
  const data = await fetchData();
  return json({ data }); // Embedded in HTML
}

// Component receives data immediately
export default function Page() {
  const { data } = useLoaderData<typeof loader>();
  return <div>{data.title}</div>;
}
```

**Benefits**:
- Faster Time to First Contentful Paint (FCP)
- Better SEO
- Progressive enhancement
- No loading spinners for initial data

### 2. Loader/Action Pattern

**Problem**: Need to handle both data fetching (GET) and mutations (POST/PUT/DELETE) cleanly.

**Solution**: Separate loaders for reads and actions for writes.

**Implementation**:
```typescript
// Loader for reading
export async function loader() {
  return json({ items: await prisma.item.findMany() });
}

// Action for writing
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  await prisma.item.create({ data: Object.fromEntries(formData) });
  return redirect('/success');
}
```

### 3. Feature-Based Architecture

**Problem**: Traditional layered architecture (controllers/views/models) creates tight coupling.

**Solution**: Organize code by features/domains, not by technical layers.

**Structure**:
```
features/
├── courses/
│   ├── CourseCard.tsx
│   ├── CourseList.tsx
│   ├── CourseDetail.tsx
│   ├── types.ts
│   └── utils.ts
├── dashboard/
│   ├── DashboardWidget.tsx
│   ├── GradesWidget.tsx
│   └── TasksWidget.tsx
```

**Benefits**:
- High cohesion (related code stays together)
- Low coupling (features are independent)
- Easier to maintain and test
- Clearer ownership

### 4. Context Provider Pattern

**Problem**: Need to share state across many components without prop drilling.

**Solution**: Use React Context for global state.

**Implementation**:
```typescript
// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### 5. Singleton Pattern (Prisma Client)

**Problem**: Creating multiple database connections is expensive and can exhaust connection pools.

**Solution**: Create a single Prisma client instance and reuse it.

**Implementation**:
```typescript
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use global to prevent hot reload issues
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
```

### 6. Middleware Pattern (Authentication)

**Problem**: Need to protect multiple routes from unauthenticated access.

**Solution**: Create reusable authentication middleware.

**Implementation**:
```typescript
export async function requireAuth(request: Request) {
  const session = await getUserFromRequest(request);
  if (!session) {
    throw redirect('/login');
  }
  return session;
}

// Use in any loader
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireAuth(request);
  // User is authenticated, proceed
}
```

## Data Flow

### Read Flow (GET Request)

```
1. User navigates to /courses
                ↓
2. React Router matches route
                ↓
3. Loader executes on server
   - Check authentication
   - Fetch data from database
                ↓
4. Server renders React components with data
                ↓
5. HTML sent to browser
                ↓
6. Browser displays page (hydration)
                ↓
7. Client-side JavaScript takes over
```

### Write Flow (POST Request)

```
1. User submits form
                ↓
2. Form data sent to server
                ↓
3. Action executes on server
   - Validate input
   - Write to database
   - Return response
                ↓
4. Response handled
   - Success: Redirect to success page
   - Error: Return error message
                ↓
5. Loader runs for new page
                ↓
6. Updated page rendered
```

## Security Architecture

### Authentication Flow

```
1. User enters credentials
                ↓
2. Server validates password (bcrypt)
                ↓
3. Server creates session record
                ↓
4. Server generates secure token
                ↓
5. Token stored in HTTP-only cookie
                ↓
6. Token also stored in database
                ↓
7. Future requests include cookie
                ↓
8. Server validates token from database
```

### Security Measures

1. **Password Security**
   - BCrypt hashing with salt
   - Minimum password requirements
   - Password reset with time-limited tokens

2. **Session Security**
   - HTTP-only cookies (no JavaScript access)
   - Secure flag in production (HTTPS only)
   - Session expiration (7 days)
   - Token stored in database (can be revoked)

3. **CSRF Protection**
   - Same-site cookie policy
   - Origin validation
   - Form tokens (React Router handles this)

4. **XSS Prevention**
   - React auto-escapes content
   - Content Security Policy headers
   - Sanitize user input

5. **SQL Injection Prevention**
   - Prisma uses parameterized queries
   - No raw SQL with user input

## Performance Optimization

### 1. Server-Side Rendering (SSR)

**Benefit**: Faster initial page load
**Implementation**: React Router v7 handles this automatically

### 2. Parallel Data Fetching

**Problem**: Sequential queries slow down page loads
**Solution**: Use `Promise.all` to fetch data in parallel

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const [courses, grades, tasks] = await Promise.all([
    prisma.course.findMany(),
    prisma.mark.findMany(),
    prisma.studentTask.findMany()
  ]);
  return json({ courses, grades, tasks });
}
```

### 3. Database Indexing

**Problem**: Slow queries on large tables
**Solution**: Add indexes to frequently queried columns

```prisma
model User {
  id       String  @id @default(uuid())
  email    String  @unique // Automatic index
  username String? @unique // Automatic index
  
  @@index([majorId]) // Manual index for foreign keys
}
```

### 4. Memoization

**Problem**: Expensive calculations run on every render
**Solution**: Use `useMemo` to cache results

```typescript
const average = useMemo(() => {
  return calculateAverage(grades);
}, [grades]);
```

### 5. Code Splitting

**Problem**: Large JavaScript bundle slows initial load
**Solution**: Lazy load routes and components

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

## Scalability Considerations

### Horizontal Scaling

The application is **stateless** (session in database, not memory), allowing multiple server instances:

```
         Load Balancer
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
Server 1  Server 2  Server 3
    └─────────┼─────────┘
              ↓
      PostgreSQL Database
```

### Database Scaling

- **Read replicas**: For read-heavy workloads
- **Connection pooling**: Prisma supports Pgbouncer
- **Caching**: Add Redis for session caching
- **Query optimization**: Use indexes and EXPLAIN

### CDN Integration

Static assets (images, CSS, JS) can be served from CDN:
- Vercel Edge Network
- Cloudflare CDN
- AWS CloudFront

## Monitoring & Observability

### Logging

```typescript
// Structured logging
console.log({
  level: 'info',
  message: 'User logged in',
  userId: user.id,
  timestamp: new Date().toISOString()
});
```

### Error Tracking

- Sentry for error monitoring
- Custom error boundaries in React
- API error logging

### Performance Monitoring

- Vercel Analytics for page load times
- Web Vitals tracking (LCP, FID, CLS)
- Database query performance (Prisma logs)

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────┐
│      Vercel Edge Network (CDN)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Vercel Serverless Functions      │
│  (React Router Node.js Runtime)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   PostgreSQL Database (External)    │
│    (Railway, Supabase, AWS RDS)     │
└─────────────────────────────────────┘
```

### Environment Variables

```env
# Production
DATABASE_URL=postgresql://...
NODE_ENV=production
SESSION_SECRET=xxx
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### CI/CD Pipeline

```
1. Push to GitHub
        ↓
2. Vercel detects push
        ↓
3. Build process
   - npm install
   - npx prisma generate
   - npm run build
        ↓
4. Run tests (if configured)
        ↓
5. Deploy to preview/production
        ↓
6. Automatic deployment URL
```

## Best Practices Summary

1. **Use loaders for data fetching** (SSR benefits)
2. **Keep components small and focused** (< 200 lines)
3. **Separate business logic from UI** (services layer)
4. **Use TypeScript for type safety**
5. **Handle errors gracefully** (try-catch, error boundaries)
6. **Optimize database queries** (indexes, parallel fetching)
7. **Secure authentication** (HTTP-only cookies, bcrypt)
8. **Test critical paths** (auth, payments, data integrity)
9. **Monitor production** (logs, errors, performance)
10. **Document complex logic** (comments, README files)

---

This architecture provides a solid foundation for building scalable, maintainable, and performant web applications with React Router v7.
