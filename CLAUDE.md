# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VTB More AI HR** - An AI-powered HR interview automation platform built with Next.js 15, TypeScript, and Tailwind CSS v4. The application automates interview processes using AI avatars and provides objective candidate assessments.

## Essential Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint checks
```

## Architecture & Code Structure

### Technology Stack
- **Framework**: Next.js 15.5.2 with App Router architecture
- **Runtime**: React 19.1.0 with TypeScript 5+
- **Styling**: Tailwind CSS v4 (CSS-first approach, no separate config)
- **Path Aliases**: `@/*` maps to `./src/*`

### Key Architectural Decisions
1. **App Router Pattern**: All routes defined in `src/app/` directory
2. **Server Components by Default**: Use `"use client"` directive only when needed
3. **Tailwind v4**: Uses new CSS-first approach without traditional config file
4. **Component Architecture**: Planning to use shadcn/ui component library

### Business Context Files
Important business documentation in `ai_docs/`:
- `business/PRD_Frontend.md` - Comprehensive product requirements
- `business/gtm_manifest.md` - Go-to-market strategy
- `ui/ui_design_system` - Component examples and patterns
- `ui/ui_quick_references.md` - Design guidelines

## Core Features to Implement

### MVP Components (Priority Order)
1. **Authentication System**: JWT-based auth with role separation (HR/Candidate)
2. **HR Dashboard**: Vacancy management, candidate overview, analytics
3. **Candidate Interface**: Profile, resume upload, interview participation
4. **Real-Time Interview**: WebRTC audio/video with AI integration
5. **Resume Analysis**: AI-powered skill extraction and matching
6. **Reporting System**: PDF generation with assessment details

### Design System Standards
- **Primary Color**: `#1B4F8C` (VTB Blue)
- **Fonts**: Geist Sans (UI), Geist Mono (code)
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance required
- **Components**: Card-based layouts with hover states

## Performance Targets
- Initial bundle: <500KB
- Total bundle: <2MB  
- Load time: <3s on 3G
- API response: <200ms
- React rendering: <100ms for interactions

## Development Guidelines

### File Organization
- **Pages & Layouts**: `src/app/[route]/page.tsx`
- **Components**: `src/components/[feature]/[Component].tsx`
- **API Routes**: `src/app/api/[endpoint]/route.ts`
- **Utilities**: `src/lib/[utility].ts`
- **Types**: `src/types/[domain].ts`

### State Management Strategy
- Server state: React Server Components for static data
- Client state: React hooks for UI state
- Form state: React Hook Form (when implemented)
- Global state: Context API or Zustand (when needed)

### API Integration Pattern
Backend services will use:
- Spring Boot microservices (Kotlin)
- PostgreSQL database
- MinIO S3 for files
- WebSocket for real-time features

### Testing Requirements
When implementing tests:
- Unit tests: 80%+ coverage
- Integration tests: 70%+ coverage  
- E2E tests: Critical user flows
- WebRTC compatibility: Cross-browser testing

## Current Implementation Status

**Completed**: Project initialization with Next.js 15, TypeScript, Tailwind v4

**Next Phase**: Authentication system and base UI components following the design system in `ai_docs/ui/`

## Important Notes

- The project uses Tailwind CSS v4's new approach - no `tailwind.config.js` file
- All UI implementations should reference the design system in `ai_docs/ui/`
- Follow the phased implementation plan in the PRD
- Maintain type safety with TypeScript strict mode
- Use Server Components by default, Client Components only when necessary