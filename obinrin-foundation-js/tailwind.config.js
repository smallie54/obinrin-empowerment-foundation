/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: "#5B21B6",
        gold: "#F4B400",
        pink: "#FCE7F3",
        charcoal: "#1F2937",
        lavender: "#F5F3FF",
        success: "#22C55E",
      },
      fontFamily: {
        heading: ["Sora", "Manrope", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
