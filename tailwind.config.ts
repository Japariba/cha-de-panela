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
        bg: '#0d0d0d',
        surface: '#161616',
        'surface-2': '#1f1f1f',
        text: '#e8e3dc',
        muted: '#6b6560',
        border: '#2a2a2a',
        accent: '#c9a96e',
        'accent-2': '#8a9e84',
        danger: '#a04040',
      },
    },
  },
  plugins: [],
}
export default config
