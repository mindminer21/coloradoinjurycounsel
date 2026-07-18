import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#003756", deep: "#02243A", ink: "#021B2C" },
        paper: "#F7F5F1",
        gold: { DEFAULT: "#C6A15B", soft: "#D9BC85" },
        sky: "#8FB8D4",
        slateblue: "#3E6079"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      maxWidth: { measure: "68ch" }
    }
  },
  plugins: []
} satisfies Config;
