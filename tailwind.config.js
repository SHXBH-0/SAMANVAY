/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          navy: '#0A2540',
          blue: '#1E3A8A',
          maroon: '#7F1D1D',
          crimson: '#991B1B',
          saffron: '#D97706',
          amber: '#B45309',
          gold: '#CA8A04',
          slate: '#F8FAFC',
          border: '#CBD5E1',
          card: '#FFFFFF',
          sidebar: '#07162C',
        },
        dept: {
          engg: '#1E40AF',       // Engineering (Track/Civil) - Royal Blue
          trd: '#B45309',        // Traction Distribution (Electrical) - Warm Amber
          snt: '#047857',        // Signal & Telecom - Forest Emerald
          traffic: '#4338CA',    // Traffic/Operating - Indigo
          opt: '#0F766E',        // Integrated Optimizer - Teal
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'gov-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
