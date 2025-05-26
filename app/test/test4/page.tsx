"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import axios from "axios";
import BackButton from "@/components/back-button";

const TopicsPage = () => {
    const [topics, setTopics] = useState([]); // Topics with summaries
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter(); // Next.js router for navigation

    // Fetch all topics with summaries on component mount
    useEffect(() => {
        const fetchTopicsWithSummaries = async () => {
            try {
                const response = await axios.get("/api/topics/user"); // Updated endpoint to include summaries
                setTopics(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch topics:", error);
                setError("Failed to load topics. Please try again later.");
                setLoading(false);
            }
        };

        fetchTopicsWithSummaries();
    }, []);

    // Handle click on the "Start" button
    const handleStart = (id: string) => {
        router.push(`/test/test4/${id}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />
            <h1 className="text-3xl font-bold text-center mb-6">
                Learn Topics
            </h1>

            {loading && (
                <p className="text-center text-gray-500">Loading topics...</p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {topics.map((topic: any) => {
                        const completionPercentage = topic.questionCount
                            ? Math.round(
                                  (topic.completedCount / topic.questionCount) *
                                      100
                              )
                            : 0;

                        return (
                            <div
                                key={topic.id}
                                className={`cursor-pointer border flex flex-col items-center bg-white shadow-md rounded-full p-5 transition-transform ${
                                    selectedTopicId === topic.id
                                        ? "ring-2 ring-indigo-500"
                                        : ""
                                }`}
                                onClick={() => setSelectedTopicId(topic.id)} // Set selected topic
                            >
                                <div className="w-20 h-20 bg-gray-100 border rounded-full flex items-center justify-center overflow-hidden mb-4">
                                    <img
                                        src="https://s3.amazonaws.com/libapps/accounts/106240/images/question-mark-1019983_1920.jpg"
                                        alt={topic.topic}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h2 className="text-sm font-semibold text-center">
                                    {topic.topic}
                                </h2>
                                <p className="text-xs text-gray-600 mt-2">
                                    {topic.questionCount || 0} Total Questions
                                </p>
                                <p className="text-xs text-green-600">
                                    {topic.correctCount || 0} Correct
                                </p>
                                <p className="text-xs text-red-600">
                                    {topic.incorrectCount || 0} Incorrect
                                </p>
                                <p className="text-xs text-blue-600">
                                    {topic.completedCount || 0} Completed
                                </p>
                                <p className="text-xs text-purple-600 font-semibold mt-2">
                                    {completionPercentage}% Completed
                                </p>
                                {selectedTopicId === topic.id && (
                                    <button
                                        onClick={() => handleStart(topic.id)}
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                                    >
                                        Start
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TopicsPage;
