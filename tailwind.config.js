/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
          poppins: ["Poppins-Regular", "sans-serif"],
        },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["fantasy", "black"],
  },
}

