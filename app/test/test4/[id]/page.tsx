"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import BackButton from "@/components/back-button";

const TopicQuestionsPage = () => {
    const [questions, setQuestions] = useState([]); // Questions with user answers
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
    const [userAnswers, setUserAnswers] = useState<any>({}); // Track user's answers
    const [submittedAnswers, setSubmittedAnswers] = useState<any>({}); // Track submitted answers
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showExplanation, setShowExplanation] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // Track if the answer is correct
    const { id } = useParams(); // Get topic ID from the URL
    const searchParams = useSearchParams(); // Access query parameters
    const router = useRouter();

    // Calculate progress percentage
    const progress = Math.round(
        ((currentQuestionIndex + 1) / questions.length) * 100
    );

    // Fetch questions for the topic and user answers
    useEffect(() => {
        const fetchQuestionsWithAnswers = async () => {
            try {
                const questionResponse = await axios.get(
                    `/api/questions?topicId=${id}`
                );
                const answerResponse = await axios.get(
                    `/api/user-answers?topicId=${id}`
                );

                const questionsWithAnswers = questionResponse.data.map(
                    (question: any) => {
                        const userAnswer = answerResponse.data.data.find(
                            (answer: any) => answer.questionId === question.id
                        );
                        return {
                            ...question,
                            userAnswer: userAnswer?.selectedAnswer || "",
                            isSubmitted: !!userAnswer, // Mark if the answer is already submitted
                        };
                    }
                );

                const questionId = searchParams.get("questionId");
                if (questionId) {
                    const index = questionsWithAnswers.findIndex(
                        (q: any) => q.id === parseInt(questionId)
                    );
                    if (index >= 0) {
                        setCurrentQuestionIndex(index);
                    }
                }

                setQuestions(questionsWithAnswers);
                setUserAnswers(
                    questionsWithAnswers.reduce((acc: any, question: any) => {
                        if (question.userAnswer) {
                            acc[question.id] = question.userAnswer;
                        }
                        return acc;
                    }, {})
                );

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch questions or answers:", error);
                setError("Failed to load questions. Please try again later.");
                setLoading(false);
            }
        };

        fetchQuestionsWithAnswers();
    }, [id]);

    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion: any = questions[currentQuestionIndex];
            router.replace(`?questionId=${currentQuestion.id}`);
        }
    }, [currentQuestionIndex, questions, router, searchParams]);

    // Handle answer selection
    const handleAnswerChange = (questionId: number, answer: string) => {
        setUserAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));

        // Mark the question as not submitted if the answer changes
        setQuestions((prevQuestions: any) =>
            prevQuestions.map((q: any) =>
                q.id === questionId ? { ...q, isSubmitted: false } : q
            )
        );
    };

    // Submit the current answer
    const handleSubmitAnswer = async () => {
        const currentQuestion: any = questions[currentQuestionIndex];
        const userAnswer = userAnswers[currentQuestion.id];

        if (!userAnswer) {
            alert("Please select or enter an answer.");
            return;
        }


        const isCorrect =
            userAnswer.trim().toLowerCase() ===
            currentQuestion.correctAnswer.trim().toLowerCase();

        console.log(currentQuestion, userAnswer);

        try {
            await axios.post("/api/user-answers", {
                questionId: currentQuestion.id,
                selectedAnswer: userAnswer,
                isCorrect,
            });

            setIsAnswerCorrect(isCorrect);
            setQuestions((prevQuestions: any) =>
                prevQuestions.map((q: any) =>
                    q.id === currentQuestion.id
                        ? { ...q, userAnswer, isSubmitted: true }
                        : q
                )
            );

            setShowExplanation(true);
        } catch (error) {
            console.error("Failed to submit answer:", error);
            alert("Failed to submit answer. Please try again.");
        }
    };

    // Move to the next question
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setShowExplanation(false);
        }
    };

    const currentQuestion: any = questions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />
            <h1 className="text-3xl font-bold text-center mb-6">
                Topic Questions
            </h1>

            {loading && (
                <p className="text-center text-gray-500">
                    Loading questions...
                </p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && questions.length === 0 && (
                <div className="text-center text-gray-700">
                    <p>No questions found for this topic.</p>
                </div>
            )}

            {!loading && !error && currentQuestion && (
                <div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                        <div
                            className="bg-indigo-600 h-4 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-center mb-6">
                        {progress}% Completed
                    </p>
                    <div className="p-6 bg-white rounded-md shadow-md mb-6">
                        <div className="mb-4">
                            <img
                                src="https://s3.amazonaws.com/libapps/accounts/106240/images/question-mark-1019983_1920.jpg"
                                alt="Question"
                                className="w-full h-auto rounded-md w-56 mx-auto"
                            />
                        </div>
                        <h2 className="font-semibold text-xl mb-4 text-gray-800">
                            Q: {currentQuestion.question}
                        </h2>
                        {currentQuestion.question_type === "multiple-choice" ? (
                            <div>
                                {currentQuestion.options.map(
                                    (option: string, index: number) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-start mb-2 bg-gray-50 p-3 rounded-md shadow-sm cursor-pointer ${
                                                userAnswers[
                                                    currentQuestion.id
                                                ] === option
                                                    ? "ring-2 ring-indigo-500 bg-indigo-50"
                                                    : "hover:bg-gray-100"
                                            }`}
                                            onClick={() =>
                                                handleAnswerChange(
                                                    currentQuestion.id,
                                                    option
                                                )
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value={option}
                                                checked={
                                                    userAnswers[
                                                        currentQuestion.id
                                                    ] === option
                                                }
                                                onChange={() =>
                                                    handleAnswerChange(
                                                        currentQuestion.id,
                                                        option
                                                    )
                                                }
                                                className="h-5 w-5 text-indigo-600"
                                            />
                                            <span className="ml-3 text-gray-700">
                                                {option}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <textarea
                                placeholder="Write your answer here"
                                value={userAnswers[currentQuestion.id] || ""}
                                onChange={(e) =>
                                    handleAnswerChange(
                                        currentQuestion.id,
                                        e.target.value
                                    )
                                }
                                className="mt-2 w-full px-4 py-2 border rounded-md shadow-sm"
                            ></textarea>
                        )}
                    </div>

                    {showExplanation && (
                        <div className="p-6 bg-gray-50 rounded-md shadow-md mb-6">
                            <p
                                className={`font-semibold text-lg ${
                                    isAnswerCorrect
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isAnswerCorrect ? "Correct!" : "Incorrect!"}
                            </p>
                            <p className="mt-2 text-gray-700">
                                <strong>Explanation:</strong>{" "}
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between">
                        {!currentQuestion.isSubmitted && (
                            <button
                                onClick={handleSubmitAnswer}
                                className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                            >
                                Submit Answer
                            </button>
                        )}
                        {showExplanation &&
                            currentQuestionIndex < questions.length - 1 && (
                                <button
                                    onClick={handleNextQuestion}
                                    className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                                >
                                    Next Question
                                </button>
                            )}
                        {showExplanation &&
                            currentQuestionIndex === questions.length - 1 && (
                                <button
                                    className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                                    onClick={() => router.push("/test/test4")}
                                >
                                    Finish Quiz
                                </button>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopicQuestionsPage;
