/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#000000',
          fg: '#FFFFFF',
          muted: 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
  },
  plugins: [],
};
