# Documentation Index

Welcome to the My Campus Redesign documentation! This page provides quick access to all documentation resources.

## 📚 Main Documentation

### Getting Started
- **[README.md](./README.md)** - Project overview, quick start guide, and feature list
- **[Installation Guide](./my-react-router-app/docs/INSTALLATION.md)** - Detailed setup instructions

### Technical Documentation
- **[CODE_WIKI.md](./CODE_WIKI.md)** - Comprehensive technical documentation covering:
  - Architecture overview
  - Directory structure
  - Core concepts (SSR, loaders, actions)
  - Authentication system
  - Database schema
  - Routing & navigation
  - Component architecture
  - State management
  - API endpoints
  - Utilities & hooks
  - Styling & theming

### Architecture & Design
- **[ARCHITECTURE.md](./my-react-router-app/docs/ARCHITECTURE.md)** - System architecture and design patterns:
  - Technology stack
  - Architecture layers
  - Design patterns (SSR, Loader/Action, Feature-based)
  - Data flow
  - Security architecture
  - Performance optimization
  - Scalability considerations
  - Deployment architecture

### API Reference
- **[API.md](./my-react-router-app/docs/API.md)** - Complete API documentation:
  - Authentication endpoints
  - Course management APIs
  - Grades APIs
  - News APIs
  - Forum APIs
  - Room booking APIs
  - File management APIs
  - Error handling
  - Rate limiting

### Component Library
- **[COMPONENTS.md](./my-react-router-app/docs/COMPONENTS.md)** - UI component documentation:
  - Layout components (AppShell, Sidebar, SearchBar)
  - UI components (Button, Card, Modal, Badge)
  - Feature components (Dashboard, Courses, Grades)
  - Component patterns
  - Styling guidelines

### Development
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines:
  - Code of conduct
  - Development workflow
  - Coding standards
  - Commit guidelines
  - Pull request process
  - Testing guidelines

## 📖 Feature Documentation

### Core Features
- **[Implementation Guide](./my-react-router-app/Implementierung_Thesis_Begleitdokument.md)** - Thesis implementation documentation (German)
- **[Requirements & Code Snippets](./my-react-router-app/docs/ANFORDERUNGEN_CODE_SNIPPETS.md)** - Feature requirements with code examples
- **[Clean Code Analysis](./my-react-router-app/docs/CLEAN_CODE_ANALYSE.md)** - Code quality analysis
- **[Login MVP](./my-react-router-app/docs/LOGIN_MVP.md)** - Authentication implementation details
- **[WCAG AAA Tokens](./my-react-router-app/docs/WCAG_AAA_TOKENS.md)** - Accessibility compliance

## 🚀 Quick Reference

### Common Tasks

#### Starting Development
```bash
cd my-react-router-app
npm install
npx prisma generate
npm run dev
```

#### Building for Production
```bash
npm run build
npm run start
```

#### Database Operations
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma db seed   # Seed database
npx prisma studio    # Open database GUI
```

#### Running Tests
```bash
npm test             # Run all tests
npm run typecheck    # Type checking
npm run lint         # Lint code
```

### Key Concepts

#### React Router v7 Loaders
```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireAuth(request);
  const data = await prisma.model.findMany();
  return json({ data });
}
```

#### React Router v7 Actions
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  await prisma.model.create({ data: Object.fromEntries(formData) });
  return redirect('/success');
}
```

#### Authentication Check
```typescript
const session = await requireAuth(request);
// User is authenticated
```

#### Database Query
```typescript
const data = await prisma.model.findMany({
  where: { field: value },
  include: { relation: true }
});
```

### File Locations

| Component | Location |
|-----------|----------|
| Routes | `app/routes/` |
| Features | `app/features/` |
| Components | `app/components/` |
| Hooks | `app/hooks/` |
| Services | `app/services/` |
| Utils | `app/utils/` |
| Types | `app/types/` |
| API Routes | `api/routes/` |
| Database Schema | `prisma/schema.prisma` |
| Config Files | Root directory |

## 🔍 Finding Information

### By Topic

| Topic | Documentation |
|-------|---------------|
| **Setup & Installation** | [README.md](./README.md), [INSTALLATION.md](./my-react-router-app/docs/INSTALLATION.md) |
| **Authentication** | [CODE_WIKI.md#authentication-system](./CODE_WIKI.md#authentication-system) |
| **Database** | [CODE_WIKI.md#database-schema](./CODE_WIKI.md#database-schema) |
| **API Endpoints** | [API.md](./my-react-router-app/docs/API.md) |
| **Components** | [COMPONENTS.md](./my-react-router-app/docs/COMPONENTS.md) |
| **Architecture** | [ARCHITECTURE.md](./my-react-router-app/docs/ARCHITECTURE.md) |
| **Contributing** | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| **Code Examples** | [ANFORDERUNGEN_CODE_SNIPPETS.md](./my-react-router-app/docs/ANFORDERUNGEN_CODE_SNIPPETS.md) |

### By User Role

#### New Contributors
1. Start with [README.md](./README.md)
2. Follow [INSTALLATION.md](./my-react-router-app/docs/INSTALLATION.md)
3. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
4. Review [ARCHITECTURE.md](./my-react-router-app/docs/ARCHITECTURE.md)

#### Frontend Developers
1. [COMPONENTS.md](./my-react-router-app/docs/COMPONENTS.md) - UI components
2. [CODE_WIKI.md#component-architecture](./CODE_WIKI.md#component-architecture) - Component patterns
3. [CODE_WIKI.md#styling--theming](./CODE_WIKI.md#styling--theming) - Styling guide

#### Backend Developers
1. [API.md](./my-react-router-app/docs/API.md) - API documentation
2. [CODE_WIKI.md#authentication-system](./CODE_WIKI.md#authentication-system) - Auth details
3. [CODE_WIKI.md#database-schema](./CODE_WIKI.md#database-schema) - Database models

#### DevOps Engineers
1. [ARCHITECTURE.md](./my-react-router-app/docs/ARCHITECTURE.md) - System architecture
2. [README.md#deployment](./README.md) - Deployment info
3. [CODE_WIKI.md#deployment](./CODE_WIKI.md#deployment) - Deploy details

## 🛠️ Tools & Resources

### Development Tools
- **React Router v7**: [Documentation](https://reactrouter.com)
- **Prisma ORM**: [Documentation](https://www.prisma.io/docs)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)
- **TypeScript**: [Handbook](https://www.typescriptlang.org/docs/)

### Accessibility
- **WCAG Guidelines**: [Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- **Screen Reader Testing**: [Guidelines](https://www.w3.org/WAI/test-evaluate/)

### Testing
- **React Testing Library**: [Documentation](https://testing-library.com/react)
- **Vitest**: [Documentation](https://vitest.dev/)

## 📝 Documentation Standards

### Writing Guidelines
- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Add links to related resources
- Use proper Markdown formatting

### Code Examples
- Include type definitions
- Show both good and bad examples
- Add comments for complex logic
- Keep examples realistic but simple

### Updating Documentation
When making changes, update relevant docs:
- Code changes → Update CODE_WIKI.md
- API changes → Update API.md
- Component changes → Update COMPONENTS.md
- Architecture changes → Update ARCHITECTURE.md

## 🤝 Getting Help

### Where to Ask
- **Issues**: [GitHub Issues](https://github.com/sabinAnwar/my-campus-redesign/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sabinAnwar/my-campus-redesign/discussions)

### Before Asking
1. Search existing issues
2. Check relevant documentation
3. Review code examples
4. Try debugging yourself

### When Asking
- Provide context
- Include error messages
- Share relevant code
- Describe what you've tried

## 📋 Checklist for New Features

- [ ] Write tests
- [ ] Update API documentation
- [ ] Update component documentation
- [ ] Add code examples
- [ ] Update README if needed
- [ ] Follow coding standards
- [ ] Test accessibility
- [ ] Check dark mode support
- [ ] Test responsive design
- [ ] Write clear commit messages

---

**Last Updated**: February 2026

This index is maintained by the project maintainers. For questions or suggestions, please open an issue.
