import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          1: "#1C1F2E",
          2: "#161925",
          3: "#252A41",
          4: "#1E2757",
        },
        blue: { 1: "#0E78F9" },
        orange: { 1: "#FF742E" },
        purple: { 1: "#830EF9" },
        yellow: { 1: "#F9A90E" },
      },
    },
  },
  plugins: [],
};
export default config;
