import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102338",
        ocean: "#0E5A8A",
        azure: "#1C86C8",
        frost: "#EAF7FF",
        silver: "#D8E0E7"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(28, 134, 200, 0.22)",
        metal: "0 18px 45px rgba(16, 35, 56, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
