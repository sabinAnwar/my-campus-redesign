# Contributing Guide

Thank you for your interest in contributing to the My Campus Redesign project! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

I am committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members
- Provide constructive feedback

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js (64-bit, LTS version recommended)
- npm or yarn
- Git
- A code editor (VS Code recommended)
- PostgreSQL database (local or remote)

### Setting Up the Development Environment

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/my-campus-redesign.git
   cd my-campus-redesign/my-react-router-app
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/sabinAnwar/my-campus-redesign.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

6. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` to see the application running.

---

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/my-new-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### Making Changes

1. **Make your changes** in the feature branch
2. **Test your changes** locally
3. **Commit your changes** following our commit guidelines
4. **Push to your fork**
   ```bash
   git push origin feature/my-new-feature
   ```

### Staying Up to Date

Regularly sync your branch with the main repository:

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream/main into your branch
git merge upstream/main

# Or rebase (if you prefer)
git rebase upstream/main
```

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

**Example**:

```typescript
// Good
interface User {
  id: string;
  email: string;
  firstName: string;
}

function getUser(id: string): Promise<User> {
  return prisma.user.findUnique({ where: { id } });
}

// Avoid
function getUser(id: any): any {
  return prisma.user.findUnique({ where: { id } });
}
```

### React Components

- Use functional components with hooks
- Keep components small (< 200 lines)
- Extract complex logic into custom hooks
- Use proper prop types

**Example**:

```typescript
// Good
interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div onClick={onClick}>
      <h3>{course.title}</h3>
    </div>
  );
}

// Avoid
function CourseCard(props: any) {
  return (
    <div onClick={props.onClick}>
      <h3>{props.course.title}</h3>
    </div>
  );
}
```

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`types.ts` containing `UserData`, `CourseInfo`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Directory Structure

Organize files by feature:

```
features/
├── courses/
│   ├── CourseCard.tsx
│   ├── CourseList.tsx
│   ├── types.ts
│   └── utils.ts
```

### Code Formatting

I use Prettier and ESLint:

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Support dark mode
- Ensure accessibility

**Example**:

```typescript
<div className="
  p-4
  rounded-lg
  bg-white dark:bg-gray-800
  shadow-md
  hover:shadow-lg
  transition-shadow
  md:p-6
">
  Content
</div>
```

---

## Commit Guidelines

I follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, config)
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

```bash
# Feature
git commit -m "feat(courses): add course filtering functionality"

# Bug fix
git commit -m "fix(auth): resolve session timeout issue"

# Documentation
git commit -m "docs(api): update API endpoint documentation"

# Refactoring
git commit -m "refactor(grades): simplify grade calculation logic"

# With body
git commit -m "feat(search): add global search functionality

Implemented debounced search across navigation items and courses.
Added keyboard shortcut (Cmd/Ctrl + K) to open search.
Includes mobile-responsive dropdown for results."
```

### Commit Best Practices

- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Capitalize the first letter of the subject
- No period at the end of the subject
- Limit subject line to 72 characters
- Include issue number if applicable: `fix(auth): resolve issue #123`

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main
2. **Run tests** and ensure they pass
3. **Run linters** and fix any issues
4. **Update documentation** if needed
5. **Add tests** for new features

### Creating a Pull Request

1. **Push your branch** to your fork
2. **Open a PR** on GitHub
3. **Fill out the PR template** completely
4. **Link related issues** (e.g., "Closes #123")

### PR Title Format

Follow the same format as commit messages:

```
feat(courses): add course filtering functionality
fix(auth): resolve session timeout issue
docs(api): update API endpoint documentation
```

### PR Description Template

```markdown
## Description

Brief description of the changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing

- [ ] Local testing completed
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated

## Screenshots (if applicable)

Add screenshots for UI changes

## Related Issues

Closes #123
Relates to #456

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by at least one maintainer
3. **Address feedback** and push updates
4. **Approval required** before merging
5. **Squash and merge** (maintainer will do this)

### After Merge

1. **Delete your branch** (local and remote)
2. **Update your main branch**
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

#### Unit Tests

```typescript
// tests/utils/gradeUtils.test.ts
import { calculateAverage } from "../app/utils/gradeUtils";

describe("calculateAverage", () => {
  it("calculates weighted average correctly", () => {
    const marks = [
      { value: 1.7, credits: 5 },
      { value: 2.3, credits: 5 },
    ];
    expect(calculateAverage(marks)).toBe(2.0);
  });

  it("returns 0 for empty array", () => {
    expect(calculateAverage([])).toBe(0);
  });

  it("handles single grade", () => {
    const marks = [{ value: 1.5, credits: 5 }];
    expect(calculateAverage(marks)).toBe(1.5);
  });
});
```

#### Integration Tests

```typescript
// tests/routes/courses.test.tsx
import { render, screen } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import CoursesRoute from '../app/routes/_app.courses';

describe('Courses Route', () => {
  it('renders course list', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/courses',
        Component: CoursesRoute,
        loader: () => ({
          courses: [
            { id: '1', title: 'Course 1', credits: 5 }
          ]
        })
      }
    ]);

    render(<RemixStub initialEntries={['/courses']} />);

    expect(screen.getByText('Course 1')).toBeInTheDocument();
  });
});
```

### Test Coverage

Aim for:

- **80%+ overall coverage**
- **100% coverage for critical paths** (auth, payments, data integrity)
- **Unit tests** for utilities and hooks
- **Integration tests** for key user flows

---

## Documentation

### Code Comments

Add comments for complex logic:

```typescript
// Calculate weighted average of grades
// Formula: Σ(grade × credits) / Σ(credits)
export function calculateAverage(marks: Mark[]): number {
  if (marks.length === 0) return 0;

  const totalWeightedGrade = marks.reduce(
    (sum, mark) => sum + mark.value * mark.credits,
    0,
  );
  const totalCredits = marks.reduce((sum, mark) => sum + mark.credits, 0);

  return totalWeightedGrade / totalCredits;
}
```

### JSDoc Comments

Use JSDoc for functions:

```typescript
/**
 * Fetches user data from the database
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to user data or null if not found
 * @throws {DatabaseError} If database connection fails
 */
async function getUser(userId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: userId } });
}
```

### README Updates

Update relevant README files when:

- Adding new features
- Changing setup process
- Updating dependencies
- Modifying configuration

### Documentation Files

Keep these up to date:

- `README.md` - Project overview
- `CODE_WIKI.md` - Technical documentation
- `API.md` - API endpoints
- `COMPONENTS.md` - Component library
- `CONTRIBUTING.md` - This file

---

## Getting Help

### Resources

- **Documentation**: Check the [Code Wiki](../CODE_WIKI.md)
- **Issues**: Browse existing [GitHub Issues](https://github.com/sabinAnwar/my-campus-redesign/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/sabinAnwar/my-campus-redesign/discussions)

### Asking Questions

When asking for help:

1. **Search existing issues** first
2. **Provide context** (what you're trying to do)
3. **Include error messages** (full stack trace)
4. **Share relevant code** (minimal reproducible example)
5. **Describe what you've tried** already

### Reporting Bugs

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
Add screenshots if applicable

**Environment**

- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox]
- Node version: [e.g., 18.17.0]

**Additional context**
Any other relevant information
```

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Thank You!

Your contributions make this project better for everyone. I appreciate your time and effort!

For questions about contributing, feel free to open an issue or reach out to the maintainers.
