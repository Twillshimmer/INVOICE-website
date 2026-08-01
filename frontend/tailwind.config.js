/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12203D",
          50: "#EEF1F6",
          100: "#D6DCE8",
          200: "#AEB9D1",
          400: "#556085",
          600: "#243250",
          700: "#1B2A45",
          800: "#12203D",
          900: "#0B1526",
        },
        paper: {
          DEFAULT: "#F5F6F4",
          dim: "#EBEDE9",
        },
        brass: {
          DEFAULT: "#B08D3F",
          50: "#FBF6EA",
          100: "#F2E4C2",
          400: "#C6A257",
          600: "#B08D3F",
          700: "#8C6F30",
        },
        teal: {
          DEFAULT: "#0E5C56",
          50: "#E7F1EF",
          600: "#0E5C56",
          700: "#0A423E",
        },
        rust: {
          DEFAULT: "#B3462C",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        ledger: "0 1px 2px rgba(18,32,61,0.06), 0 12px 32px -12px rgba(18,32,61,0.18)",
      },
    },
  },
  plugins: [],
};
