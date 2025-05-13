"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import UpgradeButton from "@/components/upgrade-button";

const PaymentCard: React.FC = () => {
    const [payment, setPayment] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/payment");
                setPayment(response.data);
            } catch (err: any) {
                setError(
                    err.response?.data?.error || "Failed to fetch payment."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPayment();
    }, []);

    if (loading) {
        return (
            <div className="p-4">
                <Loader />
            </div>
        );
    }

    if (error)
        return (
            <div className="container max-w-[1650px] flex items-center justify-center p-4">
                <p className="bg-red-100 text-red-600 p-4 rounded-md shadow-md">
                    {error}
                </p>
            </div>
        );

    return (
        <div className="container max-w-[1650px] px-3 md:px-6 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border rounded-2xl p-6">
                {payment ? (
                    <div>
                        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-5">
                            Your Current Plan
                        </h2>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>Plan:</strong>{" "}
                            {payment.payment.planType || "N/A"}
                        </p>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>Amount:</strong> {payment.payment.amount}{" "}
                            {payment.payment.currency}
                        </p>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>Status:</strong>{" "}
                            <span
                                className={
                                    payment.payment.status === "paid"
                                        ? "text-green-600"
                                        : payment.payment.status === "failed"
                                        ? "text-red-600"
                                        : "text-gray-600"
                                }
                            >
                                {payment.payment.status}
                            </span>
                        </p>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>Start Date:</strong>{" "}
                            {new Date(
                                payment.payment.createdAt
                            ).toLocaleDateString()}
                        </p>
                        <p className="text-lg text-gray-700 mb-2">
                            <strong>Total Days:</strong> {payment.totalDays}
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            <strong>Days Left:</strong> {payment.daysLeft}
                        </p>
                        <div className="flex justify-center">
                            <UpgradeButton />
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 border border-gray-300 shadow-md rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                            No Active Payment Found
                        </h2>
                        <UpgradeButton />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCard;
