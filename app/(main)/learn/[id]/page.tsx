"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Quiz from "./_components/quiz";
const ExamTimer = dynamic(() => import("../_components/exam_timer"), {
    ssr: false,
});

export default function QuizPage() {
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("examMode") === "true";
        }
        return false;
    });
    const [examCompleted, setExamCompleted] = useState(false);
    const { id }: any = useParams();
    const searchParams = useSearchParams();
    const action = searchParams.get("action");
    const showExistingAnswers = action === "start" ? false : true;
    const handleExamComplete = (examId: any) => {
        setExamCompleted(true);
    };

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "examMode") {
                setEnabled(e.newValue === "true");
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);
    return (
        <div className="container px-3 md:px-6 max-w-[1650px] pb-5">
            {action !== "review" && (
                <div className="flex items-center justify-end">
                    <ExamTimer
                        examId={id}
                        enabled={enabled}
                        onComplete={handleExamComplete}
                    />
                </div>
            )}
            <Quiz
                topicId={id}
                showExistingAnswers={showExistingAnswers}
                examEnabled={enabled}
                examCompleted={examCompleted}
            />
        </div>
    );
}
