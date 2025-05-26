import React from "react";
import { ChevronLeft } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Albert_Sans } from "@next/font/google";
import { Inter } from "@next/font/google";

const albertSans = Albert_Sans({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600"],
});

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600"],
});

interface ProgressBarProps {
    progressPercent: number; // e.g. 50
    currentNumber: number; // e.g. 2 (for question #2)
    total: number; // total questions
    correct: number;
    wrong: number;
    onPrev: () => void; // function to go to previous question
    index: number; // current index
    examEnabled: boolean; // whether the exam mode is enabled
    quizAction?: string | null; // optional action for the quiz
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progressPercent,
    currentNumber,
    total,
    correct,
    wrong,
    onPrev,
    index,
    examEnabled,
    quizAction,
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
                router.push("/learn");
            }
        });
    };

    return (
        <div className="flex items-center gap-3 mb-4">
            {/* Left arrow button */}
            <button
                onClick={handleQuitClick}
                className="p-1 bg-white border rounded-full text-gray-600 disabled:opacity-50 hover:bg-gray-200"
            >
                <ChevronLeft />
            </button>
            {/* Progress bar + fraction */}
            <div className="flex-1 flex gap-3">
                <div
                    className={`relative w-full bg-gray-200 h-3 rounded-full mt-2`}
                >
                    <div
                        className={`bg-green-500 h-3 rounded-full`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-green-300 border border-gray-100 rounded-full h-4 w-4`}
                        style={{ left: `${progressPercent}%` }}
                    ></div>
                </div>
                <div
                    className={`${albertSans.className} mt-1 text-sm text-gray-600 whitespace-nowrap`}
                >
                    {currentNumber}/{total}&#160;•&#160;
                    {total - currentNumber}&#160;left
                </div>
            </div>

            {/* Correct/Wrong scoreboard */}
            {!examEnabled || quizAction === "review" ? (
                <div className="flex items-center gap-3 border py-1 px-2 rounded-full">
                    <div className="flex items-center gap-1">
                        <Image
                            src="/q-check.svg"
                            alt="check"
                            width={15}
                            height={15}
                        />
                        {correct}
                    </div>
                    <div className="flex items-center gap-1">
                        <Image
                            src="/q-wrong.svg"
                            alt="wrong"
                            width={15}
                            height={15}
                        />
                        {wrong}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ProgressBar;
