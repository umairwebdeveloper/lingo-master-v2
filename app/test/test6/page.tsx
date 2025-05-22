"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import Loader from "@/components/loader";

export default function Page() {
    // 1. Local state for data, loading, and error
    //    Start loading = true to avoid the initial flicker.
    const [squares, setSquares] = useState<{ id: number; status: string }[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // 2. Fetch data from API on component mount
    useEffect(() => {
        const fetchSquares = async () => {
            try {
                setError("");
                const response = await axios.get(
                    "/api/user-answers/topic-questions?topicId=1"
                );
                setSquares(response.data);
            } catch (err: any) {
                setError(err?.message || "Something went wrong");
            } finally {
                // After the fetch (success or error), stop loading
                setLoading(false);
            }
        };

        fetchSquares();
    }, []);

    // 3. Loading state
    if (loading) {
        return (
            <main className="p-6 max-w-3xl mx-auto">
                <Loader />
            </main>
        );
    }

    // 4. Error state
    if (error) {
        return (
            <main className="p-6 max-w-3xl mx-auto">
                <div className="text-red-500">Error: {error}</div>
            </main>
        );
    }

    // 5. Counts
    const totalCount = squares.length;
    const pendingCount = squares.filter(
        (item) => item.status === "pending"
    ).length;
    const correctCount = squares.filter(
        (item) => item.status === "correct"
    ).length;
    const incorrectCount = squares.filter(
        (item) => item.status === "incorrect"
    ).length;

    // 6. Helper to style each square
    function getStatusClasses(status: string) {
        switch (status) {
            case "pending":
                return "bg-gray-300 text-gray-700";
            case "correct":
                return "bg-green-500 text-white";
            case "incorrect":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-200 text-gray-800";
        }
    }

    return (
        <main className="p-6 max-w-3xl mx-auto">
            {/* Header with thumbs up/down icons */}
            <header className="flex items-center space-x-6">
                {correctCount >= incorrectCount ? (
                    <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-10 h-10 text-green-500" />
                        <span className="font-medium text-gray-800">
                            Correct: {correctCount}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <ThumbsDown className="w-10 h-10 text-red-500" />
                        <span className="font-medium text-gray-800">
                            Incorrect: {incorrectCount}
                        </span>
                    </div>
                )}
            </header>

            {/* Separate Progress Bars */}
            <div className="mt-4 space-y-4">
                {/* Pending Progress Bar */}
                <div>
                    <div className="mb-1 text-sm font-medium text-gray-700">
                        {pendingCount} Pending Progress
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
                        <div
                            className="bg-gray-300 h-full"
                            style={{
                                width: `${(pendingCount / totalCount) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Correct Progress Bar */}
                <div>
                    <div className="mb-1 text-sm font-medium text-gray-700">
                        {correctCount} Correct Progress
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
                        <div
                            className="bg-green-500 h-full"
                            style={{
                                width: `${(correctCount / totalCount) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Incorrect Progress Bar */}
                <div>
                    <div className="mb-1 text-sm font-medium text-gray-700">
                        {incorrectCount} Incorrect Progress
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded overflow-hidden">
                        <div
                            className="bg-red-500 h-full"
                            style={{
                                width: `${
                                    (incorrectCount / totalCount) * 100
                                }%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Grid of squares */}
            <div className="mt-8 grid grid-cols-5 gap-4">
                {squares.map((item, index) => (
                    <div
                        key={item.id}
                        className={`flex items-center justify-center p-3 rounded text-xl font-medium ${getStatusClasses(
                            item.status
                        )}`}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </main>
    );
}
