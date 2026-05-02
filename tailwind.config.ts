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
        primary: {
          DEFAULT: "#0EA5E9",
          dark: "#0284C7",
          light: "#38BDF8",
        },
        secondary: "#06B6D4",
        accent: "#F59E0B",
        success: "#10B981",
        warning: "#F97316",
        error: "#EF4444",
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1E293B",
        },
        background: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;