import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#fdf6ee',
        blush: '#e8c4b0',
        rose: '#c47d65',
        deep: '#5a3328',
        sage: '#8a9e84',
        gold: '#c9a96e',
        muted: '#9a7b72',
        card: '#fffaf6',
        border: '#ead9ce',
      },
    },
  },
  plugins: [],
}
export default config
