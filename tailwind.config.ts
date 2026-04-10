import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563EB",
        },
        appbg: "#F8FAFC",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;

