import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00E5FF",
          dark: "#00B8D4",
          light: "#A0ECFF",
        },
        secondary: "#A0ECFF",
        accent: "#00E5FF",
        success: "#10B981",
        warning: "#F97316",
        error: "#EF4444",
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          dark: "#080E14",
        },
        background: "#080E14",
        ocean: {
          900: "#080E14",
          800: "#0D1520",
          700: "#121C2B",
          600: "#1A2738",
          500: "#243447",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        lg: "12px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 229, 255, 0.25)",
        "glow-lg": "0 0 40px rgba(0, 229, 255, 0.3)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "80px 80px",
      },
      transitionTimingFunction: {
        fluid: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 229, 255, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
