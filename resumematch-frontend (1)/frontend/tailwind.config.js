/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F6F3',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#14171F',
          soft: '#4A4F5E',
          faint: '#8A8F9C'
        },
        indigo: {
          DEFAULT: '#2A2F6B',
          deep: '#1D2050',
          light: '#4A50A0'
        },
        teal: {
          DEFAULT: '#0E7C6B',
          soft: '#E4F3F0'
        },
        amber: {
          DEFAULT: '#C77D22',
          soft: '#FBF0E1'
        },
        crimson: {
          DEFAULT: '#B23A3A',
          soft: '#FBEBEB'
        },
        line: '#E3E4E0'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 23, 31, 0.04), 0 4px 16px rgba(20, 23, 31, 0.04)',
        raised: '0 2px 4px rgba(20, 23, 31, 0.06), 0 8px 24px rgba(20, 23, 31, 0.08)'
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px'
      }
    }
  },
  plugins: []
}
