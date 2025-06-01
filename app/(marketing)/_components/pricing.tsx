// components/Pricing.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Package = {
    id: string;
    title: string;
    days: number;
    modules: number;
    price: string;
    image: string;
    recommended?: boolean;
};

const packages: Package[] = [
    {
        id: "basis",
        title: "Basis",
        days: 14,
        modules: 4,
        price: "29,99",
        image: "/landing_page/pricing/image_3.svg",
    },
    {
        id: "expert",
        title: "Expert",
        days: 31,
        modules: 10,
        price: "49,99",
        image: "/landing_page/pricing/image_1.svg",
        recommended: true,
    },
    {
        id: "gevorderd",
        title: "Gevorderd",
        days: 21,
        modules: 7,
        price: "39,99",
        image: "/landing_page/pricing/image_2.svg",
    },
];

export default function Pricing() {
    const [selected, setSelected] = useState<string>("expert");
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [isAuto, setIsAuto] = useState<boolean>(false);
    const [currentPlan, setCurrentPlan] = useState<string | null>(null);
    const router = useRouter();

    // Fetch existing payment info on mount
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get("/api/payment");
                const data = response.data;
                if (
                    !data.redirect &&
                    !data.isExpired &&
                    data.payment?.planType
                ) {
                    let planId = "";
                    switch (data.payment.planType) {
                        case "Basis":
                            planId = "basis";
                            break;
                        case "Expert":
                            planId = "expert";
                            break;
                        case "Gevorderd":
                            planId = "gevorderd";
                            break;
                    }
                    if (planId) {
                        setCurrentPlan(planId);
                        setSelected(planId);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch payment info:", error);
            }
        })();
    }, []);

    const handleOrder = async () => {
        setLoadingOrder(true);
        const planIndex = packages.findIndex((pkg) => pkg.id === selected);
        try {
            const response = await axios.post("/api/payment", {
                planNumber: planIndex,
                auto: isAuto,
            });
            window.location.href = response.data.checkoutUrl;
        } catch (error: any) {
            console.error("Order error:", error);
            if (error.response?.status === 401) {
                router.push("/sign-in");
                return;
            }
            const errorMessage =
                error.response?.data?.error || "An unknown error occurred.";
            toast.error(`Failed to create payment: ${errorMessage}`);
        } finally {
            setLoadingOrder(false);
        }
    };

    return (
        <section id="pricing" className="container mx-auto px-6 py-16">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-center">
                Kies je <span className="text-blue-600">pakket!</span>
            </h2>

            {/* Auto toggle */}
            <div className="flex justify-center my-6">
                <button
                    onClick={() => setIsAuto((prev) => !prev)}
                    className={`px-5 py-2 rounded-full border transition text-blue-600 border-blue-600 ${
                        isAuto ? "bg-blue-100" : "bg-white hover:bg-blue-50"
                    }`}
                >
                    Auto
                </button>
            </div>

            {/* Package cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {packages.map((pkg) => {
                    const isSel = selected === pkg.id;
                    const isPurchased = currentPlan === pkg.id;
                    const displayTitle = `${isAuto ? "Auto – " : ""}${
                        pkg.title
                    }`;
                    return (
                        <div
                            key={pkg.id}
                            onClick={() => !isPurchased && setSelected(pkg.id)}
                            className={`relative flex flex-col border rounded-2xl overflow-hidden cursor-pointer transition ${
                                isPurchased
                                    ? "border-green-600 bg-green-50"
                                    : isSel
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-200 bg-white hover:shadow-lg"
                            }`}
                        >
                            {/* Badge */}
                            {isPurchased ? (
                                <span className="absolute top-4 right-4 bg-green-100 text-green-600 font-semibold px-3 py-2 border rounded-full">
                                    Gekocht
                                </span>
                            ) : (
                                pkg.recommended && (
                                    <span className="absolute top-4 right-4 bg-green-100 text-green-600 font-semibold px-3 py-2 border rounded-full">
                                        Aanbevolen
                                    </span>
                                )
                            )}

                            {/* Image */}
                            <div className="p-6 flex justify-center">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    width={400}
                                    height={400}
                                    className="object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="px-6 flex-1">
                                <h3 className="text-lg font-semibold mb-4">
                                    {displayTitle}
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="ml-3 text-gray-700">
                                            {pkg.days} dagen toegang
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="ml-3 text-gray-700">
                                            {pkg.modules} CBR exammodules
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Divider */}
                            <hr className="border-dashed border-blue-600 mx-6 mt-6" />

                            {/* Price + Radio */}
                            <div className="px-6 py-4 flex items-center justify-between">
                                <span className="text-2xl font-bold">
                                    € {pkg.price}
                                </span>
                                <input
                                    type="radio"
                                    name="package"
                                    value={pkg.id}
                                    checked={isSel}
                                    disabled={isPurchased}
                                    onChange={() => setSelected(pkg.id)}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Global features */}
            <div className="mt-5 flex flex-wrap justify-center gap-8">
                {[
                    "500 oefenvragen",
                    "Verkeersbegrippen",
                    "Uitleg",
                    "24/7 support",
                ].map((feat) => (
                    <div
                        key={feat}
                        className="flex items-center space-x-2 text-gray-700"
                    >
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>{feat}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
                <button
                    onClick={handleOrder}
                    disabled={loadingOrder || selected === currentPlan}
                    className={`bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition inline-flex items-center justify-center ${
                        loadingOrder || selected === currentPlan
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    {loadingOrder ? (
                        <>
                            <Loader className="animate-spin h-5 w-5 mr-2" />
                            Bezig met verwerken...
                        </>
                    ) : selected === currentPlan ? (
                        "Al geactiveerd"
                    ) : (
                        "Bestel direct!"
                    )}
                </button>
            </div>
        </section>
    );
}
