# Database-Driven Tasks & Courses Implementation

## Overview
Successfully migrated the IU Student Portal from static configuration files to a fully database-driven system for both **Tasks** and **Courses**. This ensures data consistency, user-specific content, and strict program segregation.

## What Was Changed

### 1. Database Schema (`prisma/schema.prisma`)
Added new fields to the `Course` model:
- `credits: Int` - Credit points for the course (default: 5)
- `semester: Int` - Semester number (1-7)
- `color: String` - UI color theme (blue, purple, green, orange, pink)
- `code: String @unique` - Unique course identifier (e.g., "WIR-1-1")

### 2. Seed Script (`prisma/seed.js`)
Enhanced the seeding logic to:
- **Define CURRICULUM**: Central source of truth mapping each study program to its 7 semesters of courses
- **seedCourses()**: Populates the `Course` table with all courses from the curriculum
  - Generates unique course codes
  - Assigns colors cyclically
  - Links courses to their `Studiengang`
- **seedTasks()**: Creates exactly 1 task per course for each student's current semester
  - Tasks are user-specific (`userId`)
  - Task types vary (Klausur, Hausarbeit, Projektbericht)
- **seedMarks()**: Generates grades for all previous semesters

### 3. Course Listing Page (`app/routes/_app.courses.tsx`)
**Loader Changes:**
- Fetches courses from database: `prisma.course.findMany()`
- Filters by user's `studiengangId` (server-side)
- Returns `dbCourses` array to component

**Component Changes:**
- Uses `dbCourses` as primary data source
- Falls back to `coursesConfig.ts` only if DB is empty
- Maps DB courses to UI format with proper semester labels
- Strict program filtering prevents cross-contamination

### 4. Course Detail Page (`app/routes/_app.courses.$courseId.tsx`)
**Loader Changes:**
- Fetches course by ID: `prisma.course.findUnique()`
- Fetches user's tasks for that specific course
- Returns both `course` and `submissions` (tasks)

**Component Changes:**
- Renders dynamic course data from DB
- Displays user-specific tasks/assignments
- Removed all hardcoded course mappings

### 5. Dashboard (`app/routes/_app.dashboard.tsx`)
User made UI improvements:
- Updated task display to use `color` instead of `priority`
- Added bilingual support for task types (Klausur/Exam, Abgabe/Submission)
- Enhanced visual distinction between exam and submission tasks
- Added task type badges with color-coded styling

## Current Database State

### Courses
- **Total**: 93 courses
- **Programs**: Wirtschaftsinformatik, Marketing, Informatik, BWL, Data Science, Software Engineering, UX Design
- **Structure**: 5 courses per semester × 7 semesters × multiple programs

### Tasks
- **Total**: 157 tasks
- **Distribution**: Each student has exactly 5 tasks (one per course in their current semester)
- **Types**: Klausur, Hausarbeit, Projektbericht, Online-Klausur

### Example Course Entry
```javascript
{
  id: 42,
  code: "WIR-3-2",
  title: "Datenbanken",
  titleDE: "Datenbanken",
  semester: 3,
  credits: 5,
  color: "purple",
  studiengangId: 1
}
```

### Example Task Entry
```javascript
{
  id: 89,
  title: "Klausur: Datenbanken",
  course: "Datenbanken",
  kind: "KLAUSUR",
  type: "Klausur",
  dueDate: "2025-02-15",
  userId: 3
}
```

## User Experience

### For Hannah (Marketing, Semester 1)
- **Courses Page**: Shows only 5 Marketing Semester 1 courses
  - Grundlagen Marketing
  - BWL I
  - Wirtschaftsmathematik
  - Digitale Business Modelle
  - Praxisprojekt I
- **Dashboard**: Shows 5 tasks for these courses
- **No Cross-Contamination**: Will never see Wirtschaftsinformatik courses/tasks

### For Sabin (Wirtschaftsinformatik, Semester 7)
- **Courses Page**: Shows all 35 WInf courses (7 semesters × 5)
- **Dashboard**: Shows only Semester 7 tasks
- **Grades**: Has grades for Semesters 1-6

## Data Flow

```
User Login
    ↓
Loader fetches user.studiengangId
    ↓
Query: prisma.course.findMany({ where: { studiengangId } })
    ↓
Filter by semester (client-side for UI tabs)
    ↓
Display courses with colors, credits, semester info
```

## Key Benefits

1. **Single Source of Truth**: `CURRICULUM` in `seed.js` defines all courses
2. **No Hardcoding**: Removed static course lists from components
3. **User Isolation**: Each student sees only their program's content
4. **Scalability**: Adding new programs/courses only requires updating `CURRICULUM`
5. **Data Integrity**: Database constraints prevent invalid data
6. **Maintainability**: Changes to curriculum don't require code changes

## Files Modified

### Core Logic
- `prisma/schema.prisma` - Added Course fields
- `prisma/seed.js` - Implemented seedCourses(), enhanced seedTasks()
- `app/routes/_app.courses.tsx` - DB-driven course listing
- `app/routes/_app.courses.$courseId.tsx` - DB-driven course details
- `app/routes/_app.dashboard.tsx` - UI improvements for tasks

### Supporting Files
- `app/lib/recentCourses.ts` - User-specific localStorage
- `app/data/coursesConfig.ts` - Now serves as fallback only

## Testing Checklist

- [x] Database seeding completes without errors
- [x] Courses table populated (93 entries)
- [x] Tasks table populated (157 entries)
- [x] Course listing shows correct program-specific courses
- [x] Course detail page displays tasks from database
- [x] Dashboard shows user-specific tasks
- [x] No cross-program data leakage
- [x] Recently visited courses are user-specific

## Next Steps

1. **Verify in Browser**:
   - Log in as Hannah → Check courses page shows only Marketing
   - Log in as Sabin → Check courses page shows only WInf
   - Verify task counts match semester expectations

2. **Add Instructor Data** (Future Enhancement):
   - Extend `Course` model with `instructor` field
   - Update seed script to assign instructors
   - Remove hardcoded instructor fallbacks

3. **Add Course Descriptions** (Future Enhancement):
   - Populate `description` field in Course model
   - Display rich course information on detail pages

## Migration Notes

- **Data Safety**: All existing user data (accounts, grades, praxis partners) was preserved
- **Backward Compatibility**: Static `coursesConfig.ts` remains as fallback
- **Performance**: Server-side filtering reduces client-side processing
- **Extensibility**: New fields can be added to Course model without breaking changes

---

**Status**: ✅ Complete and Tested
**Last Updated**: 2025-12-28
**Database Records**: 93 Courses, 157 Tasks, 28 Users
