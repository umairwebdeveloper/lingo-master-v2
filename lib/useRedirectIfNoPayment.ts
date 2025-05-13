"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useRedirectIfNoPayment = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [responseData, setResponseData] = useState(null); // Store optional response data

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
                const response = await axios.get("/api/payment");
                const { redirect } = response.data;

                if (redirect) {
                    router.push("/#pricing"); // Redirect to the home page or any desired page
                } else {
                    setResponseData(response.data); // Save the optional response data
                    setLoading(false); // Only stop loading if no redirection is needed
                }
            } catch (error) {
                console.error("Error fetching payment status:", error);
                router.push("/"); // Redirect on error
            }
        };

        fetchPaymentStatus();
    }, [router]);

    return { loading, responseData }; // Return optional response data
};
