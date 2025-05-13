"use client";

import { useRedirectIfNoPayment } from "@/lib/useRedirectIfNoPayment";

const RedirectPage = () => {
    const { loading } = useRedirectIfNoPayment();

    if (loading) {
        return <div className="text-center my-4">Loading...</div>;
    }

    return "";
};

export default RedirectPage;
