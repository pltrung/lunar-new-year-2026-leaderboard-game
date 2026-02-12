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
        lunar: {
          red: "#8B1538",
          "red-deep": "#5C0A1F",
          "red-light": "#A61B3D",
          gold: "#D4AF37",
          "gold-light": "#F4E4BC",
          "gold-dark": "#B8860B",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" },
          "50%": { opacity: "0.9", boxShadow: "0 0 30px rgba(212, 175, 55, 0.6)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      backgroundImage: {
        "lunar-gradient": "linear-gradient(180deg, #5C0A1F 0%, #8B1538 40%, #5C0A1F 100%)",
        "card-glow": "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
