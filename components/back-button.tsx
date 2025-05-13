import React from "react";
import { useRouter } from "next/navigation"; // For navigation

const BackButton: React.FC = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back(); // Navigate to the previous page
    };

    return (
        <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-full transition-all flex items-center gap-2 mb-3"
            onClick={handleBack}
        >
            Back
        </button>
    );
};

export default BackButton;
