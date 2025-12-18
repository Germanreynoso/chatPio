module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'udlp': {
          'yellow': '#FFD600',
          'blue': '#0057B8',
          'gray': '#F8F8F8',
          'dark': '#22223B',
        },
        primary: {
          DEFAULT: '#0057B8', // udlp-blue
          light: '#3379C6',
          dark: '#003D81',
        },
        secondary: {
          DEFAULT: '#FFD600', // udlp-yellow
          light: '#FFDE33',
          dark: '#B39600',
        },
        dark: {
          DEFAULT: '#22223B', // udlp-dark
          light: '#4E4E62',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F8F8', // udlp-gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'udlp': '0 2px 8px 0 rgba(0,0,0,0.07)',
        'udlp-lg': '0 4px 20px 0 rgba(0,0,0,0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
}
