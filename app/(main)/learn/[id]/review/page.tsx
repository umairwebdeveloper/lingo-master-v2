"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/loader";

export default function ReviewQuestionPage() {
    const { id }: any = useParams();
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [topic, setTopic] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios
            .get<any>(`/api/user-answers/topic-questions?topicId=${id}`)
            .then((res) => {
                setQuestions(res.data.questions);
                setTopic(res.data.topic);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load review items.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="text-center mt-10">
                <Loader />
            </div>
        );
    }
    if (error) {
        return <p className="text-center mt-10 text-red-600">{error}</p>;
    }

    return (
        <div className="container px-4 md:px-6 max-w-[1200px] pb-8">
            <button
                onClick={() => router.push("/learn")}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                &larr; Back
            </button>
            <h2 className="text-2xl font-semibold mb-6">
                Review Questions: {topic?.name}
            </h2>
            {questions.map((q) => {
                const isCorrect = q.status === "correct";
                const isIncorrect = q.status === "incorrect";

                return (
                    <div
                        key={q.id}
                        className={`
              mb-8 p-6 rounded-lg shadow
              ${isCorrect ? "border-green-300 bg-green-50" : ""}
              ${isIncorrect ? "border-red-300 bg-red-50" : ""}
              ${!isCorrect && !isIncorrect ? "border-gray-200 bg-white" : ""}
            `}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                {q.questionText}
                            </h3>
                            <span
                                className={`
                  px-2 py-1 text-sm rounded-full
                  ${isCorrect ? "bg-green-200 text-green-800" : ""}
                  ${isIncorrect ? "bg-red-200 text-red-800" : ""}
                  ${
                      !isCorrect && !isIncorrect
                          ? "bg-gray-200 text-gray-800"
                          : ""
                  }
                `}
                            >
                                {q.status}
                            </span>
                        </div>

                        {q.description && (
                            <p className="text-gray-600 mb-4">
                                {q.description}
                            </p>
                        )}

                        {q.image && (
                            <img
                                src={q.image}
                                alt="Question related"
                                className="mb-4 rounded shadow-sm"
                                style={{ maxWidth: "200px", height: "auto" }}
                            />
                        )}

                        {/* Multiple-choice */}
                        {(q.type === "multiple-choice" ||
                            q.type === "multiple-choice-with-image") && (
                            <>
                                {q.selectedAnswer ? (
                                    <ul className="space-y-3">
                                        {q.options.map(
                                            (opt: string, idx: number) => {
                                                const letter =
                                                    String.fromCharCode(
                                                        65 + idx
                                                    );
                                                const selected =
                                                    opt === q.selectedAnswer;
                                                const correct =
                                                    opt === q.correctAnswer;
                                                return (
                                                    <li
                                                        key={idx}
                                                        className="flex items-start"
                                                    >
                                                        <span className="font-bold mr-3">
                                                            {letter}.
                                                        </span>
                                                        <div>
                                                            <span
                                                                className={`${
                                                                    selected
                                                                        ? correct
                                                                            ? "text-green-800"
                                                                            : "text-red-800"
                                                                        : "text-gray-800"
                                                                }`}
                                                            >
                                                                {opt}
                                                            </span>
                                                            {selected &&
                                                                correct && (
                                                                    <span className="ml-2 text-green-600">
                                                                        (Your
                                                                        answer -
                                                                        correct)
                                                                    </span>
                                                                )}
                                                            {selected &&
                                                                !correct && (
                                                                    <span className="ml-2 text-red-600">
                                                                        (Your
                                                                        answer)
                                                                    </span>
                                                                )}
                                                            {!selected &&
                                                                correct && (
                                                                    <span className="ml-2 text-green-600">
                                                                        (Correct
                                                                        answer)
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                ) : (
                                    <p className="italic text-gray-500">
                                        No answer selected. Correct answer:{" "}
                                        <span className="font-medium">
                                            {q.correctAnswer}
                                        </span>
                                    </p>
                                )}
                            </>
                        )}

                        {/* Other question types */}
                        {!(
                            q.type === "multiple-choice" ||
                            q.type === "multiple-choice-with-image"
                        ) && (
                            <div className="space-y-2">
                                <p className="text-gray-800 font-medium">
                                    Your answer:{" "}
                                    {q.selectedAnswer ? (
                                        q.selectedAnswer
                                    ) : (
                                        <span className="italic text-gray-500">
                                            None
                                        </span>
                                    )}
                                </p>
                                <p className="text-gray-800 font-medium">
                                    Correct answer: {q.correctAnswer}
                                </p>
                            </div>
                        )}

                        {q.explanation && (
                            <div className="mt-6 p-4 bg-gray-200 border rounded">
                                <h4 className="font-medium mb-1">
                                    Explanation:
                                </h4>
                                <p className="text-gray-700">{q.explanation}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
