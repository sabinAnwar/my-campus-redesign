# My Campus Redesign - Student Plattform Prototype

A modern, accessible, and feature-rich student Plattform redesign built with React Router 7, demonstrating best practices in agentic software engineering and user experience design.

<img width="1004" height="577" alt="image" src="https://github.com/user-attachments/assets/cff4ac5f-8f2e-4380-93a8-8a4eba1216c7" />

## Overview

This project is a comprehensive redesign of a university campus management system, originally developed as part of a Bachelor's thesis exploring "Vibe Coding" (Agentic Software Engineering). The prototype addresses common pain points in traditional campus Plattforms by providing:

- **Unified Experience**: All-in-one Plattform replacing fragmented systems
- **Modern UI/UX**: Glassmorphism design with dark mode support
- **Accessibility First**: WCAG 2.1 compliant with screen reader support
- **Performance Optimized**: Server-side rendering with React Router 7
- **Mobile Ready**: Responsive design with PWA capabilities

## Quick Star

### Prerequisites

- Node.js (64-bit, LTS recommended)
- npm or yarn
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/sabinAnwar/my-campus-redesign.git
cd my-campus-redesign/my-react-router-app

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Documentation

### Start Here
- **[Wiki Overview](./WIKI_OVERVIEW.md)** - Your guide to navigating all documentation

### Core Documentation
- **[Documentation Index](./DOCS_INDEX.md)** - Complete documentation directory
- **[Quick Reference](./QUICK_REFERENCE.md)** - Common tasks and code snippets
- **[Code Wiki](./CODE_WIKI.md)** - Comprehensive technical documentation
- **[Architecture](./my-react-router-app/docs/ARCHITECTURE.md)** - System design and patterns
- **[API Documentation](./my-react-router-app/docs/API.md)** - Backend endpoints and services
- **[Component Library](./my-react-router-app/docs/COMPONENTS.md)** - UI components guide
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

### Getting Started
- **[Installation Guide](./my-react-router-app/docs/INSTALLATION.md)** - Detailed setup instructions
- **[Implementation Guide](./my-react-router-app/Implementierung_Thesis_Begleitdokument.md)** - Thesis documentation (German)

### Reference
- **[Requirements & Code Snippets](./my-react-router-app/docs/ANFORDERUNGEN_CODE_SNIPPETS.md)** - Feature requirements
- **[Clean Code Analysis](./my-react-router-app/docs/CLEAN_CODE_ANALYSE.md)** - Code quality guidelines
- **[WCAG AAA Tokens](./my-react-router-app/docs/WCAG_AAA_TOKENS.md)** - Accessibility standards

## Tech Stack

- **Frontend**: React 19, React Router 7
- **Backend**: Node.js with React Router SSR
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS 4
- **UI Icons**: Heroicons, Lucide React
- **PDF Processing**: jsPDF, pdfjs-dist
- **Email**: Nodemailer
- **Analytics**: Vercel Analytics

## Key Features

### Core Features (MUST-HAVE)
- Stable authentication & session management
- High performance & availability
- Global search functionality
- Clear navigation with minimal click depth
- Reliable grade management
- Responsive design (mobile-first)
- Accessibility features (WCAG 2.1)

### Extended Features (SHOULD-HAVE)
- Personalized dashboard with widgets
- Favorites & browsing history
- Communication & support system
- Dark mode with theme switching
- Clear system feedback (toast notifications)
- PWA capabilities

### Innovative Features
- AI Learning Assistant (Lernassistent)
- Room booking system
- Interactive forum
- Practical work report tracking
- Module handbook with recommendations

## Project Structure

```
my-react-router-app/
├── app/              # Frontend application
│   ├── routes/       # Page routes and loaders
│   ├── features/     # Feature-specific components
│   ├── components/   # Shared UI components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # Server-side utilities
│   ├── store/        # Context providers
│   └── utils/        # Helper functions
├── api/              # Backend API routes
├── prisma/           # Database schema and migrations
├── public/           # Static assets
└── docs/             # Documentation
```

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run typecheck  # Run TypeScript type checking
```

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes following the code style
3. Test your changes locally
4. Submit a pull request with a clear description

## Security

- HTTP-only cookies for session management
- BCrypt password hashing
- CSRF protection
- XSS prevention
- Secure password reset flow
- Input validation and sanitization

## Internationalization

The application supports multiple languages:
- German (de) - Primary
- English (en) - Secondary

Language switching is available in the user interface.

## Contributing

I welcome contributions! Please see my [Contributing Guide](./CONTRIBUTING.md) for details on:
- Code of conduct
- Development process
- Pull request guidelines
- Coding standards

## License

This project is part of a Bachelor's thesis and is provided for educational purposes.

## Authors

- **Sabin El Anwar** - Initial work and thesis implementation


## Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check the [FAQ documentation](./my-react-router-app/docs/FAQ.md)
- Review existing issues before creating new ones

---

**Note**: This is a prototype developed for research and educational purposes, demonstrating modern web development practices and agentic software engineering methodologies.
