import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PraticeModal } from "@/components/modals/pratice-modal";
import { Toaster as ReactToast } from "react-hot-toast";
import PaymentGuard from "./PaymentGuard";
import TimeTracker from "@/components/time-tracker";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Theoriebuddy",
    description: "Theoriebuddy",
    icons: {
        icon: "/logos/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={font.className}>
                    <ReactToast />
                    <Toaster />
                    <ExitModal />
                    <HeartsModal />
                    <PraticeModal />
                    <PaymentGuard>{children}</PaymentGuard>
                    <TimeTracker />
                </body>
            </html>
        </ClerkProvider>
    );
}
