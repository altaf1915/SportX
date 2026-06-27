export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sportx: {
          bg: "#0B1020",
          primary: "#4F46E5",
          secondary: "#06B6D4",
          accent: "#22C55E"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(6, 182, 212, 0.18)"
      }
    }
  },
  plugins: []
};
