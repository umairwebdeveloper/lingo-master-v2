"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/loader";

interface PaymentGuardProps {
    children: React.ReactNode;
}

const protectedPaths = [];

export const useRedirectIfNoPayment = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.get("/api/payment");
                const { redirect } = response.data;
                if (redirect) {
                    router.push("/#pricing");
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching payment status:", error);
                router.push("/");
            }
        };

        fetchPaymentStatus();
    }, [router]);

    return { loading };
};

const PaymentGuard: React.FC<PaymentGuardProps> = ({ children }) => {
    const pathname = usePathname();
    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    const { loading } = isProtected
        ? useRedirectIfNoPayment()
        : { loading: false };

    if (isProtected && loading) {
        return (
            <div className="p-4">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
};

export default PaymentGuard;
