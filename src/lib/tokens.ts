// @/lib/tokens.ts

/**
 * Design Tokens
 *
 * This file contains the design tokens for the application.
 * These tokens are used by Tailwind CSS to generate the utility classes.
 *
 * @see https://tailwindcss.com/docs/theme
 */

// Color Palette
const colors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  'blue-electric': {
    '50': '#F0F7FF',
    '100': '#E0EFFF',
    '200': '#C2E0FF',
    '300': '#A3D1FF',
    '400': '#66B3FF',
    '500': '#3399FF', // Primary
    '600': '#0077FF',
    '700': '#005DEB',
    '800': '#0048B8',
    '900': '#003A94',
    '950': '#002C7A',
  },
  'cyan-electric': {
    '50': '#EFFFFF',
    '100': '#D9FFFF',
    '200': '#B8FFFF',
    '300': '#7DFFFF',
    '400': '#40FFFF',
    '500': '#00FFFF', // Accent
    '600': '#00D4D4',
    '700': '#00AAAA',
    '800': '#008080',
    '900': '#006666',
    '950': '#004D4D',
  },
  'neutral-dark': {
    '50': '#F7F7F8',
    '100': '#EFEFF1',
    '200': '#E2E3E5',
    '300': '#D1D2D6',
    '400': '#B6B8BE',
    '500': '#9A9CA3',
    '600': '#7C7F8A',
    '700': '#61646F',
    '800': '#4B4D57',
    '900': '#3A3B43',
    '950': '#2A2B31',
    '1000': '#1A1B1F',
    '1100': '#0F1014',
  },
  'red-danger': {
    '500': '#FF3B30', // Destructive
  },
  'green-success': {
    '500': '#34C759', // Success
  },
  'yellow-warning': {
    '500': '#FFCC00', // Warning
  },
} as const;

// Spacing Scale (in rem)
const spacing = {
  '0': '0',
  '0.5': '0.125rem', // 2px
  '1': '0.25rem', // 4px
  '2': '0.5rem', // 8px
  '3': '0.75rem', // 12px
  '4': '1rem', // 16px
  '5': '1.25rem', // 20px
  '6': '1.5rem', // 24px
  '8': '2rem', // 32px
  '10': '2.5rem', // 40px
  '12': '3rem', // 48px
  '16': '4rem', // 64px
  '20': '5rem', // 80px
  '24': '6rem', // 96px
  '32': '8rem', // 128px
} as const;

// Typography Scale
const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    mono: ['monospace'],
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
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Radii Scale
const radii = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

export const tokens = {
  colors,
  spacing,
  typography,
  radii,
};
