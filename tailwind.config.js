/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        stroke: "#D8E3EC",
        backstroke: '#F6F8FA',
        gray_stroke: "#A6B0B9",
        gray_back: "#F6F6F7",
        black: "#22252C",
        white: "#FEFEFE",
        red: "#FD2D30",
        green: "#16E042",
        dark_blue: "#242E43",

        black_80: "#4E5156",
        black_60: "#7A7C80",
        black_40: "#A7A8AB",
        black_36: "#CACBCC",
        black_24: "#DCDCDD",
        black_8: "#EDEEEE",

        dark_blue_main: "#373CD3",
        blue_main: "#474DFF",
        blue_90: "#6C71FF",
        blue_80: "#9194FF",
        blue_60: "#B5B8FF",
        blue_40: "#D3D4FF",
        blue_20: "#E2E3FF",
        blue_10: "#F0F1FF",
      },
      screens: {
        xxlg: "1200px",
        xlg: "1080px",
        smlg: "750px",
        xs: "450px",
      },
      boxShadow: {
        custom: '4px 4px 8px rgba(161, 172, 182, 0.2), -4px 0px 8px rgba(161, 172, 182, 0.2)',
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
