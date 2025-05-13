"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

const PaymentSuccess: FC = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414L9 14.414 5.293 10.707a1 1 0 111.414-1.414L9 12.586l6.293-6.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-2xl font-semibold mb-4">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your payment has been processed
                    successfully.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
