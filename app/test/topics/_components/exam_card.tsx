import React from "react";
import { Exam, ExamStatus } from "./types";
import { FileQuestion, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Tailwind color classes for the status badge
const statusBadgeColor: Record<ExamStatus, string> = {
    "In Progress": "bg-yellow-100 text-yellow-800",
    Complete: "bg-green-100 text-green-800",
    Fail: "bg-red-100 text-red-800",
};

interface ExamCardProps {
    exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
    const router = useRouter();
    const isDisabled = exam.questionsCount === 0;

    const handleStart = () => {
        if (!isDisabled) {
            router.push(`/test/topics/${exam.id}?action=start`);
        }
    };

    const handleReview = () => {
        if (!isDisabled) {
            router.push(`/test/topics/${exam.id}?action=review`);
        }
    };

    return (
        <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-md shadow mb-4 ${
                isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {/* Left side: exam name & category */}
            <div className="mb-2 sm:mb-0">
                <h3 className="font-semibold text-gray-800 text-lg">
                    {exam.name}
                </h3>
                <p className="text-sm text-gray-500">{exam.category}</p>
            </div>

            {/* Right side: counts, status, progress/empty message, buttons */}
            <div className="flex items-center space-x-4">
                {/* Total Questions Count or Empty State */}
                <div className="flex items-center text-gray-500">
                    {exam.questionsCount === 0 ? (
                        <span>Empty Questions</span>
                    ) : (
                        <>
                            <FileQuestion className="w-4 h-4 mr-1 text-gray-400" />
                            <span>{exam.questionsCount}</span>
                        </>
                    )}
                </div>

                {/* Correct Questions Count */}
                <div className="flex items-center text-green-500">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>{exam.correctCount}</span>
                </div>

                {/* Incorrect Questions Count */}
                <div className="flex items-center text-red-500">
                    <XCircle className="w-4 h-4 mr-1" />
                    <span>{exam.incorrectCount}</span>
                </div>

                {/* Status Badge - fixed width for uniform sizing */}
                <span
                    className={`text-sm font-medium px-2 py-1 rounded w-24 text-center ${
                        statusBadgeColor[exam.status]
                    }`}
                >
                    {exam.status}
                </span>

                {/* Progress Bar or Empty Message */}
                {exam.questionsCount === 0 ? (
                    <span className="text-sm text-gray-600">
                        No questions available
                    </span>
                ) : (
                    <div className="flex items-center space-x-2">
                        <div className="w-40 bg-gray-200 rounded h-2 relative">
                            <div
                                className="bg-blue-500 h-2 rounded"
                                style={{ width: `${exam.progress}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-10">
                            {exam.progress}%
                        </span>
                    </div>
                )}

                {/* Buttons: Start & Review */}
                <div className="flex space-x-2">
                    <button
                        onClick={handleStart}
                        disabled={isDisabled}
                        className={`bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        Start
                    </button>
                    <button
                        onClick={handleReview}
                        disabled={
                            exam.correctCount + exam.incorrectCount === 0 ||
                            isDisabled
                        }
                        className={`text-sm px-4 py-2 rounded transition ${
                            exam.correctCount + exam.incorrectCount === 0 ||
                            isDisabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Review Answer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamCard;
