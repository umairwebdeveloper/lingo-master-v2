import React, { useEffect, useState } from "react";
import PricingCard from "./pricing_card";
import axios from "axios";

const PricingPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null); // To store the selected plan from the API

    const packages = [
        {
            title: "Basic",
            price: "€10.00",
            duration: "7 days",
            exams: 3,
            isPopular: false,
        },
        {
            title: "Pro",
            price: "€20.00",
            duration: "14 days",
            exams: 6,
            isPopular: true,
        },
        {
            title: "Premium",
            price: "€30.00",
            duration: "28 days",
            exams: 14,
            isPopular: false,
        },
    ];

    useEffect(() => {
        // Fetch the selected plan from the API
        const fetchSelectedPlan = async () => {
            try {
                const response = await axios.get("/api/payment");
                if (response.data && response.data.payment) {
                    setSelectedPlan(response.data.payment.planType);
                }
            } catch (error) {
                console.error("Error fetching selected plan:", error);
            }
        };

        fetchSelectedPlan();
    }, []);

    return (
        <div className="bg-gray-50 py-12 my-12 rounded-lg" id="pricing">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
                    Choose Your Plan
                </h1>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg, index) => (
                        <PricingCard
                            key={pkg.title}
                            {...pkg}
                            planIndex={index}
                            isSelected={pkg.title + " Plan" === selectedPlan} // Pass selected state to PricingCard
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
