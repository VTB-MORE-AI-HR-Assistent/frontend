import { Inter, Roboto } from 'next/font/google'

// Primary font - Inter for UI
export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
})

// Secondary font - Roboto for headings (optional)
export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
  preload: false, // Only preload critical fonts
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: true,
})