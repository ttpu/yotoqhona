import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf6",
          100: "#d4f3e8",
          200: "#a8e6d3",
          300: "#7ad6bd",
          400: "#45c2a1",
          500: "#22a181",
          600: "#157f66",
          700: "#0f6452",
          800: "#0f5042",
          900: "#104337"
        }
      },
      fontFamily: {
        display: ["Manrope", "Segoe UI", "sans-serif"],
        body: ["DM Sans", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        card: "0 16px 34px -26px rgba(11, 44, 39, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
