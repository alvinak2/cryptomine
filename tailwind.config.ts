import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          primary: '#1c1c28', // Dark background
          secondary: '#2c2c3a', // Lighter background
          bitcoin: '#f7931a',
          ethereum: '#627eea',
          usdt: '#26a17b',
          solana: '#00ffbd',
          accent: '#7b3fe4', // Purple accent
          success: '#00f2ab',
          warning: '#f2a900',
          error: '#ff4b4b'
        }
      }
    }
  },
  plugins: [],
};
export default config;
