import React, { useState } from "react";
import axios from "axios";

interface PricingCardProps {
    title: string;
    price: string;
    duration: string;
    exams: number;
    isPopular?: boolean;
    planIndex: number; // Plan index for identification
    isSelected: boolean; // Check if this plan is selected
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    duration,
    exams,
    isPopular,
    planIndex,
    isSelected,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleChoosePlan = async () => {
        try {
            setIsLoading(true); // Start loading
            const response = await axios.post("/api/payment", {
                planNumber: planIndex, // Send the plan index
            });
            console.log("Payment URL:", response.data.checkoutUrl);
            window.location.href = response.data.checkoutUrl; // Redirect to Mollie checkout URL
        } catch (error: any) {
            console.error("Error creating payment:", error);
            const errorMessage =
                error.response?.data?.error || "An unknown error occurred.";
            alert(`Failed to create payment: ${errorMessage}`);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div
            className={`border rounded-lg p-6 shadow-lg transition transform hover:scale-105 ${
                isPopular ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
            } ${isSelected ? "ring-4 ring-indigo-400" : ""}`} // Highlight selected card
        >
            <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
            <p className="text-2xl font-bold mb-2 text-center text-gray-800">
                {price}
            </p>
            <p className="text-sm text-center text-gray-500 mb-4">
                {duration} platform access
            </p>
            <ul className="mb-4 space-y-2 text-center">
                <li>{exams} exams included</li>
            </ul>
            {isPopular && (
                <div className="text-center">
                    <span className="inline-block px-4 py-1 text-xs font-semibold text-white bg-indigo-500 rounded-full">
                        Most Popular
                    </span>
                </div>
            )}
            <button
                className={`mt-6 w-full px-4 py-2 rounded-lg ${
                    isSelected
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
                type="button"
                onClick={!isSelected ? handleChoosePlan : undefined} // Prevent click if selected
                disabled={isSelected || isLoading} // Disable if selected or loading
            >
                {isSelected
                    ? "Selected" // Button text changes to "Selected" if plan is selected
                    : isLoading
                    ? "Processing..."
                    : "Choose Plan"}
            </button>
        </div>
    );
};

export default PricingCard;
