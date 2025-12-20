import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oriental: {
          bg: '#F9F7F2',       // 宣紙白/米白 (背景)
          ink: '#4A3B32',      // 濃茶/深褐 (文字主色，代替純黑)
          red: '#D65D52',      // 粉朱紅 (高級且不刺眼)
          redHover: '#B8453A', // 深朱紅
          gold: '#C7A877',     // 杏金色
          sand: '#E6E0D4',     // Muji風沙色/淺卡其
        }
      },
      backgroundImage: {
        'gradient-warm': 'radial-gradient(circle at 50% 50%, #FFFAF0 0%, #F5F0E6 100%)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(214, 93, 82, 0.15)', // 淡淡的紅色光暈
        'card': '0 4px 20px rgba(74, 59, 50, 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;