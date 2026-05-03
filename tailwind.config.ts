import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          cream: "#F9F6F0",
          gold: "#D4AF37",
          goldLight: "#F5E6CA",
          goldDark: "#B8860B",
          black: "#111111",
        },
      },
      
  "compilerOptions": {
    // ... other options
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },

      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5E6CA 0%, #D4AF37 50%, #B8860B 100%)",
      },
    },
  },
  plugins: [],
};
export default config;