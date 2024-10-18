import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        headingColor: "#0c0c0c",
        bodyColor: "#515151",
        blueColor: "#2468cd",
        blueHover: "#3b4352",
        lightGray: "#ececec",
        darkGray: "#3b4352",
        white: "#ffffff",
        iota:'#6f6f6f',
        warn: '#d70404',
        yellowish :"#fffbe1"

      },
      fontFamily: {
        "Manrope": ["Manrope", "sans-serif"],      
      }
    },
  },
  plugins: [],
};
export default config;
