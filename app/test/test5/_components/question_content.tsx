import React from "react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";

interface QuestionContentProps {
    question: any; // or define a proper Question type
    answer: { response: number | string | null; feedback: boolean };
    letters: string[];
    getChoiceClasses: (choice: any, i: number) => string;
    getLetterClasses: (choice: any, i: number) => string;
    getRadioColor: (choice: any, i: number) => string;
    handleSelect: (optionIndex: number) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    nextQ: () => void;
    prevQ: () => void;
    index: number;
    total: number;
    correct: number;
    wrong: number;
}

const QuestionContent: React.FC<QuestionContentProps> = ({
    question,
    answer,
    letters,
    getChoiceClasses,
    getLetterClasses,
    getRadioColor,
    handleSelect,
    handleInputChange,
    handleSubmit,
    nextQ,
    prevQ,
    index,
    total,
    correct,
    wrong,
}) => {
    const router = useRouter();
    const { id }: any = useParams();

    const handleFinish = () => {
        Swal.fire({
            title: "Quiz Complete!",
            text: `Your score is ${correct}/${total}.`,
            icon: "success",
            showCancelButton: true,
            showDenyButton: true, // Adds a third button
            confirmButtonText: "Review Answers",
            denyButtonText: "Quit",
            cancelButtonText: "Retry",
        }).then((result) => {
            if (result.isConfirmed) {
                router.push(`/test/topics/${id}?action=review`);
            } else if (result.isDenied) {
                router.push(`/test/topics`); 
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                router.push(`/test/topics/${id}?action=start`);
            }
        });
    };

    return (
        <div className="w-full bg-white rounded-md border p-6">
            {/* Question Text */}
            <h2 className="font-bold text-2xl">{question.questionText}</h2>
            <p className="mt-1 text-gray-500 italic">
                {question.questionDetail}
            </p>

            {/* Multiple Choice */}
            {question.type === "multiple" && (
                <div className="my-4 space-y-2">
                    {question.choices.map((choice: any, i: number) => (
                        <label
                            key={i}
                            className={`flex items-center p-2 border rounded-xl cursor-pointer ${getChoiceClasses(
                                choice,
                                i
                            )}`}
                        >
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`rounded-full px-2 ${getLetterClasses(
                                        choice,
                                        i
                                    )}`}
                                >
                                    {letters[i]}
                                </span>
                                <span>{choice.text}</span>
                            </div>
                            <div className="ml-auto">
                                <input
                                    type="radio"
                                    disabled={answer.feedback} // <-- This is key
                                    checked={answer.response === i}
                                    onChange={() => handleSelect(i)}
                                    className={`form-radio h-5 w-5 ${getRadioColor(
                                        choice,
                                        i
                                    )}`}
                                />
                            </div>
                        </label>
                    ))}
                </div>
            )}

            {/* Fill in the Blank */}
            {question.type === "fill" && (
                <div className="my-4">
                    <input
                        type="text"
                        value={answer.response as string}
                        onChange={handleInputChange}
                        disabled={answer.feedback} // <-- Also disabled if feedback=true
                        className="w-full p-2 border rounded"
                        placeholder="Your answer..."
                    />
                </div>
            )}

            {/* Submit / Next / Previous / Finish Buttons */}
            <div className="flex justify-between mt-4">
                <button
                    disabled={index === 0}
                    onClick={prevQ}
                    className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                {index < total - 1 ? (
                    !answer.feedback ? (
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={nextQ}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    )
                ) : !answer.feedback ? (
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={handleFinish}
                        className="bg-purple-500 text-white px-4 py-2 rounded"
                    >
                        Finish
                    </button>
                )}
            </div>

            {/* Feedback / Explanation */}
            {answer.feedback && (
                <div className="mt-4 p-3 bg-green-50 border rounded-md">
                    {question.type === "multiple" &&
                        answer.response !== null && (
                            <>
                                {question.choices[answer.response as number]
                                    .isCorrect ? (
                                    <p className="text-green-600 font-semibold">
                                        ✔️ Correct!
                                    </p>
                                ) : (
                                    <p className="text-red-600 font-semibold">
                                        ❌ Wrong.
                                    </p>
                                )}
                            </>
                        )}
                    {question.type === "fill" && (
                        <>
                            {(answer.response as string)
                                .trim()
                                .toLowerCase() ===
                            question.correctAnswer.trim().toLowerCase() ? (
                                <p className="text-green-600 font-semibold">
                                    ✔️ Correct!
                                </p>
                            ) : (
                                <p className="text-red-600 font-semibold">
                                    ❌ Wrong.
                                </p>
                            )}
                        </>
                    )}
                    <p className="text-gray-700 italic mt-2">
                        {question.explanation}
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuestionContent;
