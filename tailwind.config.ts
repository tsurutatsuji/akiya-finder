import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        accent: "#e94560",
        warm: "#f5f0eb",
        "green-brand": "#2B5F2B",
        "gold-brand": "#C8A96E",
      },
    },
  },
  plugins: [],
};

export default config;
