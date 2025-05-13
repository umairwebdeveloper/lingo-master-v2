"use client";
import { useState, useEffect } from "react";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/progress-bar";
import { cn } from "@/lib/utils";
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

const ExamCard = ({ className }: { className?: string }) => {
    const [examData, setExamData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const res = await fetch("/api/user-answers/all_questions");
                if (!res.ok) {
                    throw new Error("Failed to fetch exam data");
                }
                const data = await res.json();
                setExamData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border p-3">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl border p-3">
                {error.message || "No data available"}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-white border flex flex-col justify-between",
                className
            )}
        >
            <div>
                <h2 className={`${albertSans.className} text-2xl text-[#3D3D3D] font-semibold leading-normal`}>
                         Examens
                </h2>
                <p className={`${albertSans.className} mt-[12px] mb-[12px] text-[#6D6D6D] text-[13.5px]`}>
                    Oefen met echte CBR vragen.
                </p>
                <button
                    onClick={() => router.push("/learn")}
                    className={`${inter.className} text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}
                    >
                    Start
                </button>

                {/* Progress Section */}
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                        <span className={`${albertSans.className} text-[#6D6D6D] text-[14px] font-normal`}>
                            Vragen: {examData.totalUserAnswers}/
                            {examData.totalQuestions}
                        </span>
                        <span className="text-sm text-gray-500">
                            {examData.progressPercentage}%
                        </span>
                    </div>
                    <ProgressBar progress={examData.progressPercentage} />
                </div>
            </div>
        </div>
    );
};

export default ExamCard;
