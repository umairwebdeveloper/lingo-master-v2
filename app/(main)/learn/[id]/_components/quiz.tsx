"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ProgressBar from "./progress_bar";
import QuestionContent from "./question_content";
import ErrorComponent from "@/components/error-component";
import Loader from "@/components/loader";

interface QuizProps {
    topicId: number;
    showExistingAnswers?: boolean;
    examEnabled: boolean;
    examCompleted: any;
    quizAction: string | null;
}

export default function Quiz({
    topicId,
    showExistingAnswers = true,
    examEnabled,
    examCompleted,
    quizAction,
}: QuizProps) {
    const letters = ["A", "B", "C", "D"];
    const searchParams = useSearchParams();
    const questionIdFromUrl = searchParams.get("questionId"); // e.g. "5"

    // State to store questions fetched from the API.
    const [questions, setQuestions] = useState<any[]>([]);
    // For each question, store { response, feedback }.
    const [answers, setAnswers] = useState<
        { response: number | string | null; feedback: boolean }[]
    >([]);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    /**
     * Helper to find the index of a choice by matching its text.
     */
    function findIndexByText(question: any, text: string) {
        return question.choices.findIndex((c: any) => c.text === text);
    }

    /**
     * Fetch a saved user answer for a single question (if any).
     */
    const fetchUserAnswer = async (questionId: number) => {
        try {
            const res = await axios.get(
                `/api/user-answers/question?questionId=${questionId}`
            );
            return res.data.answer; // null if no saved answer
        } catch (err) {
            console.error("Error fetching user answer:", err);
            return null;
        }
    };

    useEffect(() => {
        if (examCompleted) {
            router.push(
                `/learn/${topicId}/complete?total=${total}&correct=${correct}&wrong=${wrong}`
            );
        }
    }, [examCompleted]);

    /**
     * On mount, load questions and any saved answers from the DB (if showExistingAnswers is true).
     * If the URL has a questionId, jump to that question’s index.
     */
    useEffect(() => {
        async function loadQuizData() {
            setLoading(true);
            try {
                // 1) Fetch questions for this topic
                //    (Add &format=true only if your endpoint requires it)
                const res = await axios.get(
                    `/api/questions?topicId=${topicId}&format=true`
                );
                const fetchedQuestions = res.data;

                // We'll track how many are correct/wrong from existing answers
                let initialCorrect = 0;
                let initialWrong = 0;

                // 2) Build answers array, either from saved answers or fresh
                const answersFromDB = await Promise.all(
                    fetchedQuestions.map(async (q: any) => {
                        // If we do NOT want to show existing answers, always return editable
                        if (!showExistingAnswers) {
                            return {
                                response: q.type === "fill" ? "" : null,
                                feedback: false,
                            };
                        }

                        // Otherwise, try to fetch a saved answer
                        const saved = await fetchUserAnswer(q.id);
                        if (!saved) {
                            // No saved answer => user can still edit
                            return {
                                response: q.type === "fill" ? "" : null,
                                feedback: false,
                            };
                        }

                        // If there's a saved answer, mark question as read-only
                        // by setting feedback: true
                        // Also update initialCorrect/initialWrong based on isCorrect
                        const isCorrectBool = saved.isCorrect === "true";
                        if (isCorrectBool) {
                            initialCorrect++;
                        } else {
                            initialWrong++;
                        }

                        return {
                            response:
                                q.type === "fill"
                                    ? saved.selectedAnswer
                                    : findIndexByText(q, saved.selectedAnswer),
                            feedback: true, // lock the question so user cannot edit
                        };
                    })
                );

                // 3) Update state with questions & answers
                setQuestions(fetchedQuestions);
                setAnswers(answersFromDB);

                // If we're showing existing answers, set initial correct/wrong
                if (showExistingAnswers) {
                    setCorrect(initialCorrect);
                    setWrong(initialWrong);
                }

                // 4) If a questionId is passed in the URL, jump to that question
                if (questionIdFromUrl) {
                    const questionIdNum = parseInt(questionIdFromUrl, 10);
                    const foundIndex = fetchedQuestions.findIndex(
                        (question: any) => question.id === questionIdNum
                    );
                    if (foundIndex !== -1) {
                        setIndex(foundIndex);
                    }
                }
            } catch (err) {
                console.error("Error loading quiz data:", err);
            } finally {
                setLoading(false);
            }
        }

        loadQuizData();
    }, [topicId, questionIdFromUrl, showExistingAnswers]);

    // Show a loading state while fetching questions.
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto py-8 px-4">
                <Loader />
            </div>
        );
    }

    // If there are no questions, display a message.
    if (!questions || questions.length === 0) {
        return <ErrorComponent message="No questions available." />;
    }

    // Current question & answer
    const total = questions.length;
    const currentNumber = index + 1;
    const q = questions[index];
    const a = answers[index];
    const progressPercent = (currentNumber / total) * 100;

    /**
     * Store user answer in DB (POST request).
     * Adjust userId or isCorrect logic as needed for your app.
     */
    const storeUserAnswer = async (
        questionId: number,
        selectedAnswer: string,
        isCorrect: boolean
    ) => {
        try {
            await axios.post("/api/user-answers/question", {
                questionId,
                selectedAnswer,
                isCorrect,
            });
        } catch (err) {
            console.error("Error storing user answer:", err);
        }
    };

    // Navigation
    const prevQ = () => {
        if (index > 0) setIndex((i) => i - 1);
    };
    const nextQ = () => {
        if (index < total - 1) setIndex((i) => i + 1);
    };

    // Update answer for multiple-choice
    const handleSelect = (optionIndex: number) => {
        const updated = [...answers];
        updated[index] = {
            ...updated[index],
            response: optionIndex,
            feedback: false,
        };
        setAnswers(updated);
    };

    // Update answer for fill-in-the-blank
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...answers];
        updated[index] = {
            ...updated[index],
            response: e.target.value,
        };
        setAnswers(updated);
    };

    // Submit answer (common to both question types)
    const handleSubmit = async () => {
        if (!q || !a) return;

        // Multiple choice
        if (q.type === "multiple" || q.type === "multiple-choice-with-image") {
            if (a.response === null) {
                toast.error("Please select an answer before submitting!");
                return;
            }
            const updated = [...answers];
            updated[index] = { ...updated[index], feedback: true };
            setAnswers(updated);

            // Check correctness
            const chosenOption = q.choices[a.response as number];
            const isCorrect = chosenOption.isCorrect === true;
            if (isCorrect) {
                setCorrect((c) => c + 1);
            } else {
                setWrong((w) => w + 1);
            }

            // Store in DB
            await storeUserAnswer(q.id, chosenOption.text, isCorrect);

            // Fill-in-the-blank
        } else if (q.type === "fill") {
            if (!a.response || (a.response as string).trim() === "") {
                toast.error("Please type an answer before submitting!");
                return;
            }
            const updated = [...answers];
            updated[index] = { ...updated[index], feedback: true };
            setAnswers(updated);

            // Check correctness
            const userInput = (a.response as string).trim().toLowerCase();
            const correctAnswer = q.correctAnswer.trim().toLowerCase();
            const isCorrect = userInput === correctAnswer;
            if (isCorrect) {
                setCorrect((c) => c + 1);
            } else {
                setWrong((w) => w + 1);
            }

            // Store in DB
            await storeUserAnswer(q.id, a.response as string, isCorrect);
        }
    };

    // Choice styling helpers
    const getChoiceClasses = (choice: any, i: number) => {
        if (!a.feedback || examEnabled) {
            return i === a.response
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:bg-gray-100";
        }
        if (choice.isCorrect) return "bg-[#CCF9E9]";
        if (i === a.response) return "bg-[#F05252]";
        return "border-gray-300 bg-gray-50";
    };

    const getLetterClasses = (choice: any, i: number) => {
        if (!a.feedback || examEnabled) {
            return i === a.response
                ? "bg-blue-700 text-white"
                : "bg-gray-400 text-white";
        }
        if (choice.isCorrect)
            return "bg-[#15E89F] text-[#3D3D3D] border border-white";
        if (i === a.response)
            return "bg-[#F69797] text-[#3D3D3D] border border-white";
        return "bg-gray-400 text-white";
    };

    const getRadioColor = (choice: any, i: number) => {
        if (!a.feedback || examEnabled) {
            return i === a.response ? "accent-blue-600" : "accent-gray-400";
        }
        if (choice.isCorrect) return "accent-green-600";
        if (i === a.response) return "accent-red-600";
        return "accent-gray-400";
    };

    return (
        <div className="my-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left side (e.g. question image) */}
                <div className="h-fit">
                    {q.imageUrl ? (
                        <img
                            src={q.imageUrl}
                            alt="Question image"
                            className="w-100 rounded-3xl mb-2"
                        />
                    ) : (
                        <img
                            src="/question.webp"
                            alt="Question image"
                            className="w-100 rounded-3xl mb-2"
                        />
                    )}
                </div>

                {/* Right side (progress bar + question content) */}
                <div>
                    <ProgressBar
                        progressPercent={progressPercent}
                        currentNumber={currentNumber}
                        total={total}
                        correct={correct}
                        wrong={wrong}
                        onPrev={prevQ}
                        index={index}
                    />

                    <QuestionContent
                        question={q}
                        answer={a}
                        letters={letters}
                        getChoiceClasses={getChoiceClasses}
                        getLetterClasses={getLetterClasses}
                        getRadioColor={getRadioColor}
                        handleSelect={handleSelect}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        nextQ={nextQ}
                        prevQ={prevQ}
                        index={index}
                        total={total}
                        correct={correct}
                        wrong={wrong}
                        examEnabled={examEnabled}
                        quizAction={quizAction}
                    />
                </div>
            </div>
        </div>
    );
}
