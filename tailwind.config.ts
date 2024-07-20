import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        dull: {
          border: "#C1C1C1",
          text: "#848484",
          dark: "#333333",
          light: "#ACACAC",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
