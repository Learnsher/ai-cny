import type { Metadata } from "next";
import "./globals.css"; // 確保這一行存在

export const metadata: Metadata = {
  // 1. 網頁標題 (Browser Tab Title)
  title: "AI 新春祝福",
  
  // 2. 描述 (SEO Description)
  description: "上為您訂製個人專屬賀年短片。立即體驗！",
  
  // 3. WhatsApp / Facebook / LinkedIn 分享預覽
  openGraph: {
    title: "AI 新春祝福",
    description: "為您訂製個人專屬賀年短片。立即體驗！",
    url: "https://ai-cny.vercel.app", // 你的 Vercel 網址
    siteName: "AI 新春祝福",
    locale: "zh_HK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}