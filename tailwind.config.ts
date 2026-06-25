import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F6F7F9",
        surface: "#FFFFFF",
        ink: "#0F172A",
        body: "#475569",
        muted: "#94A3B8",
        line: "#E8EBEF",
        "line-strong": "#D7DCE2",
        panel: "#F4F6F8",
        brand: {
          DEFAULT: "#0F766E",
          dark: "#0B5650",
          light: "#CCFBF1",
          tint: "#F0FDFA",
        },
        info: "#2563EB",
        warn: "#C2410C",
        danger: "#DC2626",
        success: "#15803D",
        "success-bg": "#DCFCE7",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)",
        lift: "0 12px 28px -8px rgba(15,23,42,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
