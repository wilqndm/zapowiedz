/** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}"
      ],
      theme: {
        extend: {
          colors: {
            liga: "#D32F2F",
            puchar: "#2E7D32"
          },
          boxShadow: {
            'logo-glow': '0 0 6px rgba(255,255,255,0.95), 0 0 12px rgba(255,255,255,0.7)'
          },
          fontFamily: {
            sans: ['var(--font-inter)']
          }
        }
      },
      plugins: []
    }
