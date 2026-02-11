# Component Library Documentation

This document provides an overview of the reusable components in the My Campus Redesign application.

## Table of Contents

1. [Layout Components](#layout-components)
2. [UI Components](#ui-components)
3. [Feature Components](#feature-components)
4. [Component Patterns](#component-patterns)
5. [Styling Guidelines](#styling-guidelines)

---

## Layout Components

### AppShell

The main application wrapper that provides the overall layout structure.

**Location**: `app/routes/_app.tsx`

**Props**: None (uses loader data)

**Features**:
- Responsive sidebar navigation
- Top search bar
- Profile menu
- Theme toggle
- Outlet for child routes

**Usage**:
```typescript
// Automatically wraps all /_app routes
export default function AppLayout() {
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

---

### Sidebar

Persistent navigation sidebar with menu items.

**Location**: `app/layouts/shell/Sidebar.tsx`

**Features**:
- Responsive (collapsible on mobile)
- Active route highlighting
- Icon support
- Multi-language labels
- Glassmorphism styling

**Usage**:
```typescript
<Sidebar />
```

---

### SearchBar

Global search component in the top navigation.

**Location**: `app/layouts/shell/SearchBar.tsx`

**Features**:
- Debounced search input
- Keyboard shortcuts (Cmd/Ctrl + K)
- Results dropdown
- Search across navigation and courses
- Mobile-responsive

**Props**:
```typescript
interface SearchBarProps {
  placeholder?: string;
}
```

---

### ProfileMenu

User profile dropdown menu.

**Location**: `app/layouts/shell/ProfileMenu.tsx`

**Features**:
- User avatar
- Settings link
- Logout button
- Click outside to close

---

## UI Components

### PageHeader

Standard page header with title and optional subtitle.

**Location**: `app/components/PageHeader.tsx`

**Props**:
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
```

**Usage**:
```typescript
<PageHeader
  title="My Courses"
  subtitle="View all your enrolled courses"
  action={<button>Add Course</button>}
/>
```

---

### Card

Reusable card component with consistent styling.

**Location**: `app/components/ui/Card.tsx`

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}
```

**Usage**:
```typescript
<Card hover onClick={() => navigate('/course/1')}>
  <h3>Course Title</h3>
  <p>Course description</p>
</Card>
```

---

### Button

Styled button component with variants.

**Location**: `app/components/ui/Button.tsx`

**Props**:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

**Usage**:
```typescript
<Button variant="primary" size="md" onClick={handleSubmit}>
  Submit
</Button>

<Button variant="outline" loading>
  Loading...
</Button>
```

---

### Badge

Small badge/tag component.

**Location**: `app/components/ui/Badge.tsx`

**Props**:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}
```

**Usage**:
```typescript
<Badge variant="success">Completed</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

---

### Modal

Modal/dialog component with overlay.

**Location**: `app/components/ui/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Usage**:
```typescript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

---

### ThemeToggle

Button to toggle between light and dark themes.

**Location**: `app/components/ThemeToggle.tsx`

**Usage**:
```typescript
<ThemeToggle />
```

---

### LanguageToggle

Dropdown to switch between languages.

**Location**: `app/components/LanguageToggle.tsx`

**Usage**:
```typescript
<LanguageToggle />
```

---

### ScreenReaderToggle

Toggle for screen reader mode.

**Location**: `app/components/ScreenReaderToggle.tsx`

**Usage**:
```typescript
<ScreenReaderToggle />
```

---

### FeedbackToast

Toast notification component (uses react-toastify).

**Location**: Integrated via `app/utils/toast.ts`

**Usage**:
```typescript
import { toast } from '~/utils/toast';

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.info('Information message');
```

---

### LoadingSpinner

Animated loading indicator.

**Location**: `app/components/ui/LoadingSpinner.tsx`

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}
```

**Usage**:
```typescript
<LoadingSpinner size="lg" />
```

---

### EmptyState

Component for displaying empty states.

**Location**: `app/components/ui/EmptyState.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ComponentType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Usage**:
```typescript
<EmptyState
  icon={BookOpen}
  title="No courses yet"
  description="You haven't enrolled in any courses"
  action={<Button>Browse Courses</Button>}
/>
```

---

## Feature Components

### Dashboard Components

#### GradesWidget

Displays grade overview on dashboard.

**Location**: `app/features/dashboard/GradesWidget.tsx`

**Props**:
```typescript
interface GradesWidgetProps {
  grades: Mark[];
}
```

---

#### TasksWidget

Shows upcoming tasks and deadlines.

**Location**: `app/features/dashboard/TasksWidget.tsx`

**Props**:
```typescript
interface TasksWidgetProps {
  tasks: StudentTask[];
}
```

---

#### NewsWidget

Recent news articles preview.

**Location**: `app/features/dashboard/NewsWidget.tsx`

**Props**:
```typescript
interface NewsWidgetProps {
  news: News[];
}
```

---

#### ScheduleWidget

Shows upcoming schedule events.

**Location**: `app/features/dashboard/ScheduleWidget.tsx`

**Props**:
```typescript
interface ScheduleWidgetProps {
  events: ScheduleEvent[];
}
```

---

### Course Components

#### CourseCard

Card component for displaying course information.

**Location**: `app/features/courses/CourseCard.tsx`

**Props**:
```typescript
interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}
```

**Usage**:
```typescript
<CourseCard
  course={course}
  onClick={() => navigate(`/courses/${course.id}`)}
/>
```

---

#### CourseList

Grid layout for course cards.

**Location**: `app/features/courses/CourseList.tsx`

**Props**:
```typescript
interface CourseListProps {
  courses: Course[];
  loading?: boolean;
}
```

---

#### CourseFilters

Filter controls for course list.

**Location**: `app/features/courses/CourseFilters.tsx`

**Props**:
```typescript
interface CourseFiltersProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
}
```

---

#### CourseDetailTabs

Tabbed interface for course details.

**Location**: `app/features/courses/CourseDetailTabs.tsx`

**Tabs**:
- Overview
- Feed
- Forum
- Notes
- Resources
- Submissions
- Tests
- Videos

---

### Grades Components

#### GradesTable

Table displaying all grades.

**Location**: `app/features/grades/GradesTable.tsx`

**Props**:
```typescript
interface GradesTableProps {
  grades: Mark[];
  showSemester?: boolean;
  sortable?: boolean;
}
```

---

#### GradeChart

Visual chart of grade distribution.

**Location**: `app/features/grades/GradeChart.tsx`

**Props**:
```typescript
interface GradeChartProps {
  grades: Mark[];
  type?: 'bar' | 'line' | 'pie';
}
```

---

### News Components

#### NewsCard

Card component for news articles.

**Location**: `app/features/news/NewsCard.tsx`

**Props**:
```typescript
interface NewsCardProps {
  news: News;
  featured?: boolean;
}
```

---

#### NewsDetail

Detailed news article view.

**Location**: `app/features/news/NewsDetail.tsx`

**Props**:
```typescript
interface NewsDetailProps {
  news: News;
}
```

---

### Settings Components

#### SettingsSection

Section wrapper for settings pages.

**Location**: `app/features/settings/SettingsSection.tsx`

**Props**:
```typescript
interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}
```

---

#### ProfileSettings

User profile editing form.

**Location**: `app/features/settings/ProfileSettings.tsx`

---

#### NotificationSettings

Notification preferences form.

**Location**: `app/features/settings/NotificationSettings.tsx`

---

### Forum Components

#### ForumTopicCard

Card for forum topic display.

**Location**: `app/features/forum/ForumTopicCard.tsx`

**Props**:
```typescript
interface ForumTopicCardProps {
  topic: ForumTopic;
}
```

---

#### ForumPost

Individual forum post component.

**Location**: `app/features/forum/ForumPost.tsx`

**Props**:
```typescript
interface ForumPostProps {
  post: ForumPost;
  onLike?: () => void;
  onReply?: () => void;
}
```

---

## Component Patterns

### Container/Presenter Pattern

Separate logic from presentation:

```typescript
// Container (with logic)
function CourseListContainer() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []);
  
  return <CourseListPresenter courses={courses} loading={loading} />;
}

// Presenter (pure UI)
function CourseListPresenter({ courses, loading }: CourseListPresenterProps) {
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

---

### Compound Components Pattern

Components that work together:

```typescript
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

### Render Props Pattern

For flexible component reuse:

```typescript
interface DataFetcherProps<T> {
  url: string;
  render: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return <>{render(data, loading, error)}</>;
}

// Usage
<DataFetcher<Course[]>
  url="/api/courses"
  render={(courses, loading, error) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    return <CourseList courses={courses || []} />;
  }}
/>
```

---

## Styling Guidelines

### Tailwind CSS Classes

Use Tailwind utility classes for styling:

```typescript
<div className="
  p-4 
  rounded-lg 
  bg-white 
  dark:bg-gray-800 
  shadow-md 
  hover:shadow-lg 
  transition-shadow
">
  Content
</div>
```

---

### Responsive Design

Use responsive prefixes:

```typescript
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  gap-4
">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>
```

---

### Dark Mode Support

Use dark mode classes:

```typescript
<div className="
  bg-white 
  dark:bg-gray-900 
  text-gray-900 
  dark:text-white
">
  Content adapts to theme
</div>
```

---

### Glassmorphism Effect

Apply glass effect:

```typescript
<div className="
  backdrop-blur-md 
  bg-white/10 
  dark:bg-black/20 
  border 
  border-white/20
">
  Glass effect content
</div>
```

---

### Accessibility Classes

Include accessible attributes:

```typescript
<button
  className="btn-primary"
  aria-label="Submit form"
  role="button"
  tabIndex={0}
>
  Submit
</button>
```

---

## Best Practices

1. **Keep components small and focused** (< 200 lines)
2. **Use TypeScript for type safety**
3. **Extract reusable logic into hooks**
4. **Use composition over inheritance**
5. **Make components responsive by default**
6. **Support dark mode in all components**
7. **Include proper accessibility attributes**
8. **Document complex components**
9. **Write tests for critical components**
10. **Use meaningful prop names**

---

For more examples and usage, refer to the existing components in the codebase or check the [CODE_WIKI.md](../CODE_WIKI.md).
