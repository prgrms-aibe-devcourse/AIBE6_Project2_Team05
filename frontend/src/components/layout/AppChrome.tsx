"use client";

import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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

export function AppChrome({ children }: AppChromeProps) {
    const pathname = usePathname();
    const isChromeDisabled = CHROME_DISABLED_PATHS.has(pathname);

    if (isChromeDisabled) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
            <ChatbotWidget />
        </>
    );
}
