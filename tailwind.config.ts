import type { Config } from "tailwindcss";
import TailwindForms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      margin: { tomato: "120px" },
      borderRadius: { smooth: "11.11px" },
    },
  },
  plugins: [TailwindForms],
};
export default config;
