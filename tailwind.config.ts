import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#0f172a",
        background: "#020617",
        card: "#111827",
        aqua: "#67e8f9",
        gold: "#facc15",
        obsidian: "#020617",
        panel: "#0f172a",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        premium: "0 10px 30px rgba(0,0,0,0.15)",
        glow: "0 0 40px rgba(103,232,249,0.25)",
      },
    },
  },

  plugins: [],
};

export default config;
