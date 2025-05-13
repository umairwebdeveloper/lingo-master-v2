"use client";
import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Quiz from "./_components/quiz";
const ExamTimer = dynamic(() => import("../_components/exam_timer"), {
    ssr: false,
});

export default function QuizPage() {
    const [examCompleted, setExamCompleted] = useState(false);
    const { id }: any = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const action = searchParams.get("action");
    const examName: any = searchParams.get("name");
    // const examCategory: any = searchParams.get("category");
    const showExistingAnswers = action === "start" ? false : true;
    const handleExamComplete = (examId: any) => {
        setExamCompleted(true);
    };

    return (
        <div className="container px-3 md:px-6 max-w-[1650px] pb-5">
            {action !== "review" && (
                <div className="flex items-center justify-end">
                    <ExamTimer examId={id} onComplete={handleExamComplete} />
                </div>
            )}
            <Quiz
                topicId={id}
                showExistingAnswers={showExistingAnswers}
                examCompleted={examCompleted}
            />
        </div>
    );
}
