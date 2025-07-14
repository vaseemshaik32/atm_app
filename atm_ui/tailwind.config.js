/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14', // Bright neon green
        'neon-pink': '#ff44cc',  // Vivid neon pink
      },
      boxShadow: {
        glow: '0 0 8px rgba(57, 255, 20, 0.8), 0 0 16px rgba(255, 68, 204, 0.8)', // Glowing effect
      },
      colors: {
        'neon-green': '#39ff14', // Retro neon green
        'neon-pink': '#ff44cc', // Retro neon pink
      },
      boxShadow: {
        glow: '0 0 8px rgba(57, 255, 20, 0.8), 0 0 16px rgba(255, 68, 204, 0.8)', // Neon glow effect
      },
    },
  },
  plugins: [],
}

