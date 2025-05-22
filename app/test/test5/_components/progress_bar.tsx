import React from "react";
import { ChevronLeft } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface ProgressBarProps {
    progressPercent: number; // e.g. 50
    currentNumber: number; // e.g. 2 (for question #2)
    total: number; // total questions
    correct: number;
    wrong: number;
    onPrev: () => void; // function to go to previous question
    index: number; // current index
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progressPercent,
    currentNumber,
    total,
    correct,
    wrong,
    onPrev,
    index,
}) => {
    const router = useRouter();
    const handleQuitClick = () => {
        Swal.fire({
            title: "Quit Quiz?",
            text: "Are you sure you want to quit?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Quit",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                router.push("/test/topics");
            }
        });
    };

    return (
        <div className="flex items-center gap-4 mb-4">
            {/* Left arrow button */}
            <button
                onClick={handleQuitClick}
                className="p-2 bg-gray-100 rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-200"
            >
                <ChevronLeft />
            </button>

            {/* Progress bar + fraction */}
            <div className="flex-1">
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full bg-green-500 transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="mt-1 text-sm text-gray-600">
                    {currentNumber}/{total} • {total - currentNumber} left
                </div>
            </div>

            {/* Correct/Wrong scoreboard */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <span className="text-green-600">✔️</span>
                    {correct}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-red-600">❌</span>
                    {wrong}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
