// src/app/layout.tsx
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wedge — 웨딩 프리랜서 매칭 플랫폼",
  description: "현대적인 커플을 위한 큐레이팅된 웨딩 전문가 매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${playfairDisplay.variable} ${beVietnamPro.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf9f2] text-[#1b1c18]">
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}
