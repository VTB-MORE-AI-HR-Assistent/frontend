# VTB AI HR Assistant

A modern, AI-powered HR management platform built with Next.js, TypeScript, and Tailwind CSS. This application streamlines the recruitment process with intelligent automation, data-driven insights, and seamless candidate management.

![VTB HR Assistant](https://img.shields.io/badge/VTB-HR_Assistant-1B4F8C?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Authentication System
- **Modern Split-Screen Design**: Beautiful authentication pages with animated carousel
- **Secure Login**: Email/password authentication with validation
- **Smart Registration**: Streamlined single-page registration flow
- **Password Strength Indicators**: Real-time password strength feedback
- **Responsive Design**: Perfect experience on all devices

### UI/UX Highlights
- **VTB Brand Identity**: Custom color palette and design system
- **Component Library**: Extended shadcn/ui components with VTB styling
- **Animated Interfaces**: Smooth transitions and floating elements
- **Dark/Light Themes**: Support for multiple color modes
- **Accessibility**: WCAG compliant components

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Mock Data System**: Complete mock data for development
- **Reusable Components**: Modular component architecture
- **Performance Optimized**: Fast loading and rendering
- **SEO Ready**: Meta tags and structured data support

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Tables**: [TanStack Table](https://tanstack.com/table)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 📦 Installation

### Prerequisites
- Node.js 18.18.0 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vtb-ai-hr-assistant.git
cd vtb-ai-hr-assistant/my-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
my-app/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── login/        # Login page
│   │   │   └── register/     # Registration page
│   │   ├── (hr)/            # HR dashboard pages (coming soon)
│   │   ├── (candidate)/     # Candidate portal pages (coming soon)
│   │   └── globals.css      # Global styles
│   │
│   ├── components/           # React components
│   │   ├── ui/              # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx   # Extended button with VTB variants
│   │   │   ├── vtb-card.tsx # Custom VTB card components
│   │   │   └── ...          # Other UI components
│   │   ├── features/        # Feature-specific components
│   │   │   ├── status-badge.tsx
│   │   │   └── data-table.tsx
│   │   └── layout/          # Layout components
│   │       ├── auth-split-layout.tsx  # Split-screen auth layout
│   │       ├── navigation.tsx
│   │       ├── sidebar.tsx
│   │       └── dashboard-layout.tsx
│   │
│   ├── lib/                 # Utility functions
│   │   ├── constants.ts     # App constants and routes
│   │   ├── mock-data.ts     # Mock data for development
│   │   └── utils.ts         # Helper functions
│   │
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Shared interfaces
│
├── public/                  # Static assets
├── ai_docs/                # Documentation
│   └── documentation/      # Implementation logs
└── package.json           # Project dependencies
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#1B4F8C` - VTB brand color
- **Secondary Blue**: `#2563EB` - Accent blue
- **Indigo**: `#4F46E5` - Supporting color
- **Gradients**: Linear gradients combining brand colors

### Component Variants
- **Buttons**: vtbPrimary, vtbSecondary, vtbGhost, vtbSuccess, vtbDanger
- **Cards**: default, gradient, dark, elevated, outline
- **Badges**: Status-specific colors and styles

## 🚦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 📱 Pages Overview

### Authentication Pages
- **`/login`** - Modern split-screen login with carousel
- **`/register`** - Streamlined registration for HR managers

### Coming Soon
- **HR Dashboard** - Main dashboard for HR managers
- **Candidate Management** - View and manage candidates
- **Job Postings** - Create and manage job vacancies
- **Analytics** - Recruitment metrics and insights
- **Interview Scheduling** - AI-powered scheduling system

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Tailwind Configuration
The project uses Tailwind CSS v3 with custom VTB design tokens. Configuration can be found in `tailwind.config.ts`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by VTB Bank.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Design inspiration from modern authentication patterns

## 📞 Contact

For questions or support, please contact the VTB HR Development Team.

---

**Built with ❤️ by VTB Bank Development Team**