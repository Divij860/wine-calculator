/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wine: {
          50: "#fbf4f4",
          100: "#f6e4e6",
          200: "#eec6cb",
          600: "#9b2c3a",
          700: "#7f2230",
          800: "#63202a",
          900: "#4f1b23",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
