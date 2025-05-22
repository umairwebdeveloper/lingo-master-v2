"use client";

import React from "react";
import { useRouter } from "next/navigation"; // For navigation

const QuizActions: React.FC = () => {
    const router = useRouter();

    const handleCreateTopic = () => {
        router.push("/test/test2");
    };

    const handleCreateQuestion = () => {
        router.push("/test/test3");
    };

    const handleSeeQuiz = () => {
        router.push("/test/test4");
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
                onClick={handleCreateTopic}
            >
                Create Topics
            </button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
                onClick={handleCreateQuestion}
            >
                Create Questions
            </button>
            <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-all"
                onClick={handleSeeQuiz}
            >
                See Quiz
            </button>
        </div>
    );
};

export default QuizActions;
