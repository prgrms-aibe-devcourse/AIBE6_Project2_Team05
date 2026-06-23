"use client";

import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type AppChromeProps = {
    readonly children: ReactNode;
};

const CHROME_DISABLED_PATHS = new Set([
    "/login",
    "/signup",
    "/oauth2/callback",
]);

// 채팅방: Footer 없이 전체 높이를 차지해야 내부 스크롤 가능
const FOOTER_DISABLED_PATTERN = /^\/chat\/\d+/;

export function AppChrome({ children }: AppChromeProps) {
    const pathname = usePathname();
    const isChromeDisabled = CHROME_DISABLED_PATHS.has(pathname);
    const isFooterDisabled = FOOTER_DISABLED_PATTERN.test(pathname);

    if (isChromeDisabled) {
        return <div className="flex flex-1 flex-col"><PageTransition>{children}</PageTransition></div>;
    }

    return (
        <div className="flex flex-1 flex-col">
            <Navbar />
            <main className={`flex flex-1 flex-col ${isFooterDisabled ? "min-h-0" : ""}`}>
                <PageTransition>{children}</PageTransition>
            </main>
            {!isFooterDisabled && <Footer />}
            <ChatbotWidget />
        </div>
    );
}
