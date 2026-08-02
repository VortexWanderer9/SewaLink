import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: "#1A2440",
          900: "#23315A",
          700: "#34467D",
          500: "#4C5FA0",
        },
        marigold: {
          600: "#C97F1E",
          500: "#E8A33D",
          400: "#F2BB63",
          100: "#FBEBD2",
        },
        paper: {
          100: "#F6F2E9",
          200: "#EFE8D8",
          50: "#FBF9F4",
        },
        ink: {
          900: "#221F1C",
          700: "#4A443E",
          400: "#8A8377",
        },
        sage: {
          600: "#4C7351",
          500: "#5F8C64",
          100: "#DEEBDF",
        },
        brick: {
          500: "#A8503A",
          100: "#F0DAD2",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
        devanagari: ["var(--font-noto-devanagari)", "sans-serif"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      borderRadius: {
        "xl2": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
