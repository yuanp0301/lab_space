/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#E8F0FE",
          100: "#D1E1FD",
          200: "#A3C3FB",
          300: "#75A5F9",
          400: "#4F8CFF",
          500: "#4F8CFF",
          600: "#3B6FD9",
          700: "#2A52B3",
          800: "#1A3A8C",
          900: "#0F2766",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
