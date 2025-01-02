module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#f7f3eb',
          100: '#f0e6d6',
          200: '#e1ccad',
          300: '#d2b384',
          400: '#c39a5b',
          500: '#b48132',
          600: '#906728',
          700: '#6c4d1e',
          800: '#483314',
          900: '#241a0a',
        },
        burgundy: {
          50: '#fdf2f4',
          100: '#fce4e9',
          200: '#f9cad3',
          300: '#f5a3b3',
          400: '#ef7088',
          500: '#e63d5a',
          600: '#d11d3a',
          700: '#af162f',
          800: '#91152a',
          900: '#781628',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
