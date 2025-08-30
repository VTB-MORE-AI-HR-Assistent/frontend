# VTB AI HR Assistant - Frontend Implementation Plan

## Project Overview

**Timeline**: 8 weeks  
**Scope**: Frontend UI/UX only (no backend implementation)  
**Stack**: Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui  
**Approach**: Build complete UI with mock data, ready for backend integration

## Phase 1: Foundation & Setup (Week 1)

### Day 1-2: Project Configuration

**Goal**: Set up robust development environment

#### Tasks:

1. **shadcn/ui Setup**

   ```bash
   # Initialize shadcn/ui (configures Tailwind, creates components folder)
   npx shadcn@latest init

   # When prompted, select:
   # - TypeScript: Yes
   # - Style: Default
   # - Base color: Slate
   # - CSS variables: Yes
   ```

2. **Add shadcn/ui Components**

   ```bash
   # Add all needed components (automatically installs Radix dependencies)
   npx shadcn@latest add button
   npx shadcn@latest add card
   npx shadcn@latest add dialog
   npx shadcn@latest add dropdown-menu
   npx shadcn@latest add form
   npx shadcn@latest add input
   npx shadcn@latest add label
   npx shadcn@latest add select
   npx shadcn@latest add tabs
   npx shadcn@latest add textarea
   npx shadcn@latest add toast
   npx shadcn@latest add avatar
   npx shadcn@latest add badge
   npx shadcn@latest add checkbox
   npx shadcn@latest add radio-group
   npx shadcn@latest add switch
   npx shadcn@latest add table
   npx shadcn@latest add calendar
   npx shadcn@latest add popover
   npx shadcn@latest add command
   npx shadcn@latest add separator
   npx shadcn@latest add sheet
   npx shadcn@latest add skeleton
   npx shadcn@latest add progress
   npx shadcn@latest add alert
   npx shadcn@latest add alert-dialog
   ```

3. **Additional Dependencies**

   ```bash
   # Only install what shadcn doesn't provide
   npm install recharts           # For charts
   npm install date-fns           # Date utilities
   npm install @tanstack/react-table  # For advanced data tables
   ```

4. **Project Structure**
   ```
   src/
   ├── app/
   │   ├── (auth)/
   │   │   ├── login/page.tsx
   │   │   └── register/page.tsx
   │   ├── (hr)/
   │   │   └── dashboard/...
   │   ├── (candidate)/
   │   │   └── portal/...
   │   └── (public)/
   │       └── page.tsx
   ├── components/
   │   ├── ui/           # Base UI components
   │   ├── layout/       # Layout comlponents
   │   ├── features/     # Feature-specific components
   │   └── charts/       # Chart components
   ├── lib/
   │   ├── utils.ts      # Utility functions
   │   ├── mock-data.ts  # Mock data
   │   └── constants.ts  # App constants
   ├── hooks/            # Custom React hooks
   ├── types/            # TypeScript types
   └── styles/           # Additional styles
   ```

### Day 3-4: Mock Data & Types

**Goal**: Create comprehensive mock data structure

#### Tasks:

1. **TypeScript Interfaces**

   ```typescript
   // types/index.ts
   export interface User {
     id: string;
     email: string;
     firstName: string;
     lastName: string;
     password: string;
   }

   export interface Vacancy {
     id: string;
     title: string;
     department: string;
     location: string;
     type: "Full-time" | "Part-time" | "Contract";
     status: "Active" | "Paused" | "Closed";
     applicants: number;
     interviewed: number;
     description: string;
     requirements: string[];
     salary: { min: number; max: number; currency: string };
     createdAt: Date;
   }

   export interface Candidate {
     id: string;
     name: string;
     email: string;
     phone: string;
     position: string;
     experience: number;
     skills: string[];
     matchScore: number;
     status: "New" | "Screening" | "Interview" | "Offer" | "Rejected";
     resumeUrl?: string;
     appliedAt: Date;
   }

   export interface Interview {
     id: string;
     candidateId: string;
     vacancyId: string;
     scheduledAt: Date;
     duration: number;
     type: "Technical" | "Behavioral" | "Cultural";
     status: "Scheduled" | "InProgress" | "Completed" | "Cancelled";
     score?: number;
     feedback?: string;
   }
   ```

2. **Mock Data Generation**

   ```typescript
   // lib/mock-data.ts
   export const mockVacancies: Vacancy[] = [
     {
       id: "1",
       title: "Senior Frontend Developer",
       department: "Engineering",
       location: "Moscow",
       type: "Full-time",
       status: "Active",
       applicants: 47,
       interviewed: 12,
       // ... more fields
     },
   ];

   export const mockCandidates: Candidate[] = [
     {
       id: "1",
       name: "Ivan Petrov",
       email: "ivan@example.com",
       position: "Frontend Developer",
       experience: 5,
       skills: ["React", "TypeScript", "Next.js"],
       matchScore: 85,
       status: "Interview",
       // ... more fields
     },
   ];
   ```

### Day 5: VTB Theme Configuration

**Goal**: Implement VTB brand theming

#### Tasks:

1. **Customize shadcn/ui Theme**

   ```css
   /* app/globals.css - After shadcn init, update CSS variables */
   @layer base {
     :root {
       /* Override shadcn's default colors with VTB colors */
       --primary: 203 61 35; /* VTB Blue #1B4F8C in HSL */
       --primary-foreground: 0 0 100;

       /* Keep shadcn's structure but with VTB colors */
       --background: 0 0 100;
       --foreground: 222.2 84 4.9;

       /* Custom VTB variables */
       --vtb-primary: #1b4f8c;
       --vtb-primary-dark: #143a66;
       --vtb-primary-light: #2563eb;
       --vtb-gradient: linear-gradient(135deg, #1b4f8c 0%, #2563eb 100%);
     }
   }
   ```

2. **Extend Tailwind Configuration**

   ```typescript
   // tailwind.config.ts (shadcn will create this)
   const config = {
     theme: {
       extend: {
         colors: {
           vtb: {
             primary: "#1B4F8C",
             "primary-dark": "#143A66",
             "primary-light": "#2563EB",
             secondary: "#3B82F6",
             accent: "#4F46E5",
           },
         },
         backgroundImage: {
           "vtb-gradient": "linear-gradient(135deg, #1B4F8C 0%, #2563EB 100%)",
           "vtb-gradient-dark":
             "linear-gradient(135deg, #143A66 0%, #1B4F8C 100%)",
         },
       },
     },
   };
   ```

3. **Custom Utility Classes**

   ```css
   /* app/globals.css - Add after shadcn styles */
   @layer utilities {
     .text-gradient {
       @apply text-transparent bg-clip-text bg-gradient-to-r from-[#1B4F8C] to-[#2563EB];
     }

     .btn-vtb-primary {
       @apply bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] hover:from-[#143A66] hover:to-[#1B4F8C];
     }
   }
   ```

**Deliverables**: Complete project setup with mock data structure

---

## Phase 2: Design System & Components (Week 2)

### Day 1-2: Customize shadcn Components

**Goal**: Customize shadcn components for VTB branding

#### Components to Customize:

1. **Extend Button Component**

   ```typescript
   // components/ui/button.tsx (modify after shadcn adds it)
   // Add VTB gradient variant to existing button
   const buttonVariants = cva(
     "...", // existing shadcn styles
     {
       variants: {
         variant: {
           default: "...", // existing
           vtbPrimary:
             "bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white hover:from-[#143A66] hover:to-[#1B4F8C]",
           // ... other existing variants
         },
       },
     }
   );
   ```

2. **Create Custom Card Components**

   ```typescript
   // components/ui/vtb-card.tsx (extends shadcn card)
   import { Card } from "@/components/ui/card";

   export function VTBGradientCard({ children, className, ...props }) {
     return (
       <Card
         className={cn(
           "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
           className
         )}
         {...props}
       >
         {children}
       </Card>
     );
   }
   ```

3. **Enhance Form Components**
   ```typescript
   // Already handled by shadcn/ui form component
   // Just need to use with react-hook-form and zod
   ```

### Day 3-4: Build Custom Components

**Goal**: Build VTB-specific components using shadcn primitives

#### Components:

1. **Data Table (using @tanstack/react-table)**

   ```typescript
   // components/features/data-table.tsx
   // Build on top of shadcn's table component
   - Use shadcn Table component as base
   - Add sorting with @tanstack/react-table
   - Add filtering and search
   - Add pagination using shadcn Pagination
   - Row selection with shadcn Checkbox
   - Export functionality
   ```

2. **Status Components**

   ```typescript
   // components/features/status-badge.tsx
   // Extend shadcn Badge with HR-specific variants
   export function StatusBadge({ status, type }) {
     const variants = {
       candidate: {
         approved: "bg-green-100 text-green-700",
         pending: "bg-amber-100 text-amber-700",
         rejected: "bg-red-100 text-red-700",
       },
       interview: {
         scheduled: "bg-blue-100 text-[#1B4F8C]",
         completed: "bg-indigo-100 text-indigo-700",
       },
     };
   }
   ```

3. **Custom Dialogs**
   ```typescript
   // Use shadcn Dialog/Sheet components directly
   // They already provide all needed functionality
   ```

### Day 5: Layout Components

**Goal**: Create main layout structure using shadcn components

#### Components:

1. **Navigation (using shadcn components)**

   ```typescript
   // components/layout/navigation.tsx
   - Use shadcn Sheet for mobile menu
   - Use shadcn DropdownMenu for user menu
   - Use shadcn Popover for notifications
   - Use shadcn Command for search
   ```

2. **Sidebar**

   ```typescript
   // components/layout/sidebar.tsx
   - Use shadcn Sheet for mobile sidebar
   - Use shadcn Button for menu items
   - Use shadcn Separator for sections
   - Use shadcn Tooltip for collapsed state
   ```

3. **Page Layouts**
   ```typescript
   // components/layout/dashboard-layout.tsx
   // components/layout/auth-layout.tsx
   // components/layout/public-layout.tsx
   ```

**Deliverables**: Complete component library with VTB branding

---

## Phase 3: Authentication UI & Layouts (Week 3)

### Day 1-2: Authentication Pages

**Goal**: Build auth flow UI

#### Pages:

1. **Login Page**

   - Email/password form
   - Remember me checkbox
   - Forgot password link
   - Social login buttons (UI only)
   - VTB branded design

2. **Register Page**

   - Multi-step registration
   - Role selection (HR/Candidate)
   - Form validation
   - Terms acceptance

### Day 5: Protected Routes

**Goal**: Implement route protection UI

#### Features:

1. **Route Guards**
   - Loading states
   - Redirect logic
   - 404/403 pages

**Deliverables**: Complete authentication and onboarding UI

---

## Phase 4: HR Dashboard Pages (Week 4)

### Day 1: Dashboard Overview

**Goal**: Build main dashboard page

#### Components:

1. **Metrics Cards**

   - Total vacancies
   - Active candidates
   - Scheduled interviews
   - Hiring funnel

2. **Charts & Graphs**

   - Application trends
   - Department distribution
   - Time-to-hire metrics

3. **Activity Feed**
   - Recent applications
   - Upcoming interviews
   - Team activities

### Day 2-3: Vacancy Management

**Goal**: Complete vacancy CRUD UI

#### Pages:

1. **Vacancy List**

   - Grid/list view toggle
   - Filters and search
   - Bulk actions
   - Quick stats

2. **Create/Edit Vacancy**

   - Multi-step form
   - Rich text editor
   - Requirement builder
   - Preview mode

3. **Vacancy Detail**
   - Overview tab
   - Applicants tab
   - Analytics tab
   - Settings tab

### Day 4-5: Candidate Management

**Goal**: Build candidate tracking UI

#### Features:

1. **Candidate Pipeline**

   - Kanban board view
   - Drag-and-drop
   - Stage transitions
   - Quick actions

2. **Candidate Profile**

   - Resume viewer
   - Assessment scores
   - Interview history
   - Notes and feedback

3. **Bulk Operations**
   - Mass email
   - Status updates
   - Export to CSV

**Deliverables**: Complete HR dashboard with all management features

---

## Phase 5: Candidate Portal Pages (Week 5)

### Day 1-2: Candidate Dashboard

**Goal**: Build candidate-facing interface

#### Pages:

1. **Profile Page**

   - Personal information
   - Experience timeline
   - Skills matrix
   - Document uploads

2. **Job Browser**
   - Job cards with match %
   - Advanced filters
   - Saved searches
   - Job alerts setup

### Day 3-4: Application Management

**Goal**: Application tracking UI

#### Features:

1. **My Applications**

   - Application status cards
   - Timeline view
   - Withdrawal option
   - Reapply functionality

2. **Application Flow**
   - Job detail view
   - Quick apply
   - Cover letter builder
   - Application preview

### Day 5: Interview Preparation

**Goal**: Interview prep interface

#### Components:

1. **Interview Dashboard**
   - Scheduled interviews
   - Preparation resources
   - Company information
   - Interview tips

**Deliverables**: Complete candidate portal UI

---

## Phase 6: Interview UI Components (Week 6)

### Day 1-2: Video Interview Interface

**Goal**: Build interview room UI

#### Components:

1. **Pre-Interview**

   - Device check UI
   - Camera/mic preview
   - Waiting room
   - Instructions display

2. **Interview Room**
   - Video grid layout
   - Controls toolbar
   - Question panel
   - Timer display
   - Chat sidebar

### Day 3-4: AI Interview Components

**Goal**: AI interviewer interface

#### Features:

1. **AI Avatar Display**

   - Avatar animation area
   - Speech indicators
   - Emotion display
   - Subtitles

2. **Question Flow**
   - Current question display
   - Progress indicator
   - Skip/next buttons
   - Help options

### Day 5: Interview Results

**Goal**: Post-interview UI

#### Components:

1. **Results Dashboard**
   - Score breakdown
   - Skill assessment
   - Feedback display
   - Next steps

**Deliverables**: Complete interview UI system

---

## Phase 7: Analytics & Reports UI (Week 7)

### Day 1-2: Analytics Dashboard

**Goal**: Build analytics visualization

#### Components:

1. **KPI Dashboard**

   - Metric cards
   - Trend charts
   - Comparison graphs
   - Heat maps

2. **Custom Reports**
   - Report builder UI
   - Filter panels
   - Date range picker
   - Export options

### Day 3-4: Report Templates

**Goal**: Pre-built report layouts

#### Templates:

1. **Candidate Report**

   - Assessment summary
   - Skills matrix
   - Interview feedback
   - Recommendations

2. **Vacancy Report**
   - Performance metrics
   - Applicant funnel
   - Time analysis
   - Source effectiveness

### Day 5: Data Visualization

**Goal**: Advanced charts

#### Components:

1. **Interactive Charts**
   - Drill-down capability
   - Tooltips
   - Legends
   - Zoom/pan

**Deliverables**: Complete analytics and reporting UI

---

## Phase 8: Polish & Optimization (Week 8)

### Day 1-2: Responsive Design

**Goal**: Perfect mobile experience

#### Tasks:

- Mobile navigation
- Touch gestures
- Responsive tables
- Mobile-specific layouts

### Day 3-4: Performance Optimization

**Goal**: Achieve performance targets

#### Optimizations:

- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis
- Font optimization

### Day 5: Final Polish

**Goal**: Production readiness

#### Tasks:

- Loading states
- Error boundaries
- Empty states
- Animations
- Accessibility audit

**Deliverables**: Polished, optimized frontend application

---

## Implementation Priorities

### Must Have (MVP)

1. Authentication UI
2. HR Dashboard
3. Vacancy Management
4. Candidate List
5. Basic Interview UI

### Should Have

1. Candidate Portal
2. Analytics Dashboard
3. Report Generation UI
4. AI Interview Components

### Nice to Have

1. Advanced animations
2. Dark mode
3. Multiple languages
4. Keyboard shortcuts

## Component Development Order

### Week 1-2: Foundation

```
1. Button, Input, Card
2. Layout components
3. Navigation, Sidebar
4. Form components
```

### Week 3-4: Core Features

```
1. Auth pages
2. Dashboard overview
3. Vacancy CRUD
4. Candidate list
```

### Week 5-6: Advanced Features

```
1. Candidate portal
2. Interview UI
3. Pipeline view
4. Profile pages
```

### Week 7-8: Polish

```
1. Analytics
2. Reports
3. Responsive fixes
4. Performance
```

## Mock Data Strategy

### Static JSON Files

```typescript
// lib/mock/vacancies.json
// lib/mock/candidates.json
// lib/mock/interviews.json
```

### Mock API Functions

```typescript
// lib/api-mock.ts
export async function getVacancies() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockVacancies;
}
```

### Local Storage for State

```typescript
// lib/storage.ts
export function saveToLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}
```

## Deployment Checklist

### Pre-deployment

- [ ] Remove all console.logs
- [ ] Add proper meta tags
- [ ] Implement error boundaries
- [ ] Add loading states everywhere
- [ ] Test all responsive breakpoints

### Performance Targets

- Lighthouse score >90
- First paint <1.5s
- Bundle size <500KB
- Image optimization complete

### Documentation

- [ ] Component documentation
- [ ] Mock data structure docs
- [ ] API integration guide
- [ ] Deployment guide

This frontend-only plan focuses on building a complete, polished UI that's ready for backend integration, with all components, pages, and interactions fully implemented using mock data.
