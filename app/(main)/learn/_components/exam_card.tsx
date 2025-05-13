import React, { useState } from "react";
import { Exam, ExamStatus } from "./types";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Albert_Sans } from '@next/font/google';
import { Inter } from '@next/font/google';



const albertSans = Albert_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})

// Tailwind color classes for the status badge
const statusBadgeColor: Record<ExamStatus, string> = {
    "Open": "bg-yellow-100 text-yellow-800",
    Geslaagd: "bg-green-100 text-green-800",
    Gezakt: "bg-red-100 text-red-800",
};

interface ExamCardProps {
    exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
    const router = useRouter();

    const handleStart = () => {
        router.push(
            `/learn/${exam.id}?action=start&name=${exam.name}&category=${exam.category}`
        );
    };

    const handleReview = () => {
        router.push(
            `/learn/${exam.id}?action=review&name=${exam.name}&category=${exam.category}`
        );
    };

    return (
        <div
  className={`
    grid items-center grid-cols-1
    [@media(min-width:768px)]:[grid-template-columns:30%_36%_30%]
    [@media(min-width:768px)_and_(max-width:802.4px)]:[grid-template-columns:25%_30%_39%]
    [@media(min-width:1024px)]:[grid-template-columns:31%_30%_35%]
    [@media(min-width:1416px)]:[grid-template-columns:44%_30%_22%]
    gap-5 bg-white p-4 rounded-2xl border mb-4 bg-[#f6f6f6] hover:bg-white
  `}
>
            <div className="flex gap-3 justify-between">
                <div className="mb-2 sm:mb-0">
                <h3 className={`${albertSans.className} font-semibold text-[#3D3D3D] text-[18px] font-medium leading-normal`}>
                        {exam.name}
                    </h3>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center text-gray-500">
                        {exam.questionsCount === 0 ? (
                            <span>Empty Questions</span>
                        ) : (
                            <>
                                <div className="inline-flex text-xs text-gray-600 text-wrap items-center space-x-1 bg-[#F6F6F6] border border-[#E7E7E7] rounded-lg px-2 py-1">
                                    <Image
                                        src="/file-01.svg"
                                        alt="video"
                                        width={15}
                                        height={15}
                                        color="#5D5D5D"
                                    />
                                    <span className={`${albertSans.className} text-[#3D3D3D] text-[13px] font-medium`}
>
                                        {exam.questionsCount}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span
                    className={`
        text-sm font-medium px-2 py-1 rounded-lg w-24 text-center whitespace-nowrap
        ${statusBadgeColor[exam.status]}
      `}
                >
                    {exam.status}
                </span>

                {exam.questionsCount === 0 ? (
                    <span className="text-sm text-gray-600">
                        No questions available
                    </span>
                ) : (
                    <div className="flex items-center w-full space-x-2">
                        {/* Progress bar track is now 100% width */}
                        <div className="bg-gray-200 h-2 w-full rounded">
                            <div
                                className="bg-[#0A65FC] h-2 rounded"
                                style={{ width: `${exam.progress}%` }}
                            ></div>
                        </div>
                        <span className={`${albertSans.className} text-[14px] font-medium leading-[150%] tracking-[-0.21px] text-[var(--GreyScale-900,#3D3D3D)]`}>
                            {exam.progress}%
                        </span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-end">
                <div className="flex justify-center w-full lg:w-auto gap-2">
                    <button
                        onClick={handleStart}
                        className={`${inter.className} w-1/2 lg:w-auto text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}

                    >
                        {exam.progress === 100 ? "Opnieuw" : "Start"}
                    </button>

                    <button
                        onClick={handleReview}
                        disabled={exam.correctCount + exam.incorrectCount === 0}

                        
                        className={`${inter.className} 
                                w-1/2 lg:w-auto
                                text-sm 
                                px-4 
                                py-2 
                                rounded-full 
                                transition
                                ${
                                    exam.correctCount + exam.incorrectCount ===
                                    0
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[#fffff] border-solid border-2 border-[#E7E7E7] text-[#6D6D6D] hover:bg-gray-200"
                                }
                            `}
                    >
                        Bekijk uitslag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamCard;
