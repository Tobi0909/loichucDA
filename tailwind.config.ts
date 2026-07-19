import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-app)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0) scale(0.9)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-120px) scale(1.1)", opacity: "0" },
        },
        fadeSlide: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        fadeSlide: "fadeSlide 0.6s ease-out both",
        twinkle: "twinkle 3s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        floatUp: "floatUp 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
