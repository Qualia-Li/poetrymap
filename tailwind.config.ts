import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        secondary: '#D2691E',
        accent: '#CD853F',
        background: '#FDF5E6',
        text: '#2F1810',
      },
      fontFamily: {
        song: ['Noto Serif SC', 'serif'],
        kai: ['ZCOOL KuaiLe', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config
