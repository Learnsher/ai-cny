import type { Metadata } from "next";
import "./globals.css"; // 確保這一行存在

export const metadata: Metadata = {
  title: "LUMIÈRE | Year of the Snake 2025",
  description: "High-End CNY AI Experience",
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