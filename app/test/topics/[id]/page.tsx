"use client";

import { useParams, useSearchParams } from "next/navigation";
import Quiz from "../../test5/_components/quiz";

export default function QuizPage() {
    const { id }: any = useParams();
    const searchParams = useSearchParams();
    const action = searchParams.get("action");

    const topicId = id;
    const showExistingAnswers = action === "start" ? false : true;

    return (
        <div>
            <Quiz topicId={topicId} showExistingAnswers={showExistingAnswers} />
        </div>
    );
}
