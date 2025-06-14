/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Deep blue (primary) - blue-600
        'primary-50': '#EFF6FF', // Light blue (50-level shade) - blue-50
        'primary-100': '#DBEAFE', // Light blue (100-level shade) - blue-100
        'primary-500': '#3B82F6', // Medium blue (500-level shade) - blue-500
        'primary-700': '#1D4ED8', // Dark blue (700-level shade) - blue-700
        
        // Secondary Colors
        'secondary': '#64748B', // Neutral slate (secondary) - slate-500
        'secondary-100': '#F1F5F9', // Light slate (100-level shade) - slate-100
        'secondary-200': '#E2E8F0', // Light slate (200-level shade) - slate-200
        'secondary-600': '#475569', // Medium slate (600-level shade) - slate-600
        'secondary-700': '#334155', // Dark slate (700-level shade) - slate-700
        
        // Accent Colors
        'accent': '#10B981', // Success green (accent) - emerald-500
        'accent-50': '#ECFDF5', // Light green (50-level shade) - emerald-50
        'accent-100': '#D1FAE5', // Light green (100-level shade) - emerald-100
        'accent-600': '#059669', // Dark green (600-level shade) - emerald-600
        
        // Background Colors
        'background': '#F8FAFC', // Soft off-white (background) - slate-50
        'surface': '#FFFFFF', // Pure white (surface) - white
        
        // Text Colors
        'text-primary': '#1E293B', // Dark slate (text primary) - slate-800
        'text-secondary': '#64748B', // Medium gray (text secondary) - slate-500
        
        // Status Colors
        'success': '#059669', // Darker green (success) - emerald-600
        'success-50': '#ECFDF5', // Light success green - emerald-50
        'success-100': '#D1FAE5', // Light success green - emerald-100
        
        'warning': '#D97706', // Amber orange (warning) - amber-600
        'warning-50': '#FFFBEB', // Light warning amber - amber-50
        'warning-100': '#FEF3C7', // Light warning amber - amber-100
        
        'error': '#DC2626', // Clear red (error) - red-600
        'error-50': '#FEF2F2', // Light error red - red-50
        'error-100': '#FEE2E2', // Light error red - red-100
        
        // Border Colors
        'border': '#E2E8F0', // Border color - slate-200
        'border-light': '#F1F5F9', // Light border color - slate-100
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'md': '6px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      scale: {
        '98': '0.98',
      },
      zIndex: {
        '1000': '1000',
        '1010': '1010',
        '1020': '1020',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}