import React from "react";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
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
    examEnabled: boolean;
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
    examEnabled,
}) => {
    const router = useRouter();
    const { id }: any = useParams();

    const handleFinish = () => {
        router.push(
            `/learn/${id}/complete?total=${total}&correct=${correct}&wrong=${wrong}`
        );
    };

    const handleNextQuestion = () => {
        handleSubmit();
        if (examEnabled) {
            nextQ();
        }
    };

    return (
        <>
            <div className="w-full bg-white rounded-[var(--Special-Gap-01-20,20px)] border border-[var(--GreyScale-100,#E7E7E7)] p-[var(--Text-gap-small-24,24px)] px-[var(--Spacing-6,24px)]">
                {/*{question.category && (
                    <span className={`${albertSans.className} text-[16px] font-semibold leading-[150%] text-[var(--GreyScale-900,#3D3D3D)] rounded-full`}>
                        {question.category}
                    </span>
                )} */}
                <h2
                    className={`${albertSans.className} font-semibold text-[28px] leading-[150%] text-[var(--GreyScale-900,#3D3D3D)] mt-[4px]`}
                >
                    {question.questionText}
                </h2>
                <p
                    className={`${albertSans.className} mt-1 text-[16px] font-normal leading-[150%] tracking-[-0.24px] text-[var(--GreyScale-500,#6D6D6D)]`}
                >
                    {question.questionDetail}
                </p>

                {/* Multiple Choice */}
                {question.type === "multiple" && (
                    <div className="my-4 space-y-2">
                        {question.choices.map((choice: any, i: number) => (
                            <label
                                key={i}
                                className={`flex items-center p-2 border rounded-full cursor-pointer ${getChoiceClasses(
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
                                    <span
                                        className={`${albertSans.className} text-[#3D3D3D] text-[16px] font-normal leading-[120%] tracking-[-0.24px]`}
                                    >
                                        {choice.text}
                                    </span>
                                </div>
                                <div className="ml-auto flex">
                                    <input
                                        type="radio"
                                        disabled={answer.feedback}
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

                {/* Multiple Choice With Images */}
                {question.type === "multiple-choice-with-image" && (
                    <div className="my-4 grid grid-cols-2 gap-4">
                        {question.choices.map((choice: any, i: number) => (
                            <label
                                key={i}
                                className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer ${getChoiceClasses(
                                    choice,
                                    i
                                )}`}
                            >
                                {choice.image && (
                                    <div className="w-24 h-24 relative">
                                        <img
                                            src={choice.image}
                                            alt={`Option ${letters[i]}`}
                                            className="object-cover rounded-xl w-full h-full"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center mt-2">
                                    <span
                                        className={`rounded-full px-2 ${getLetterClasses(
                                            choice,
                                            i
                                        )}`}
                                    >
                                        {letters[i]}
                                    </span>
                                    <span className="ml-2">{choice.text}</span>
                                </div>
                                <input
                                    type="radio"
                                    disabled={answer.feedback}
                                    checked={answer.response === i}
                                    onChange={() => handleSelect(i)}
                                    className={`form-radio mt-2 h-5 w-5 ${getRadioColor(
                                        choice,
                                        i
                                    )}`}
                                />
                            </label>
                        ))}
                    </div>
                )}

                {/* Fill in the Blank */}
                {question.type === "fill" && (
                    <div className="my-4 flex items-center">
                        <input
                            type="text"
                            value={answer.response as string}
                            onChange={handleInputChange}
                            disabled={answer.feedback}
                            className="w-full p-2 border rounded-xl"
                            placeholder="Your answer..."
                        />
                        <div className="p-2 rounded-xl">
                            <p>km/u</p>
                        </div>
                    </div>
                )}

                <hr />
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                    <button
                        disabled={index === 0}
                        onClick={prevQ}
                        className={`${inter.className} bg-[#ffffff] pl-6 pr-6 border-2 border-[#E7E7E7] text-[#6D6D6D] rounded-full disabled:opacity-50`}
                    >
                        Terug
                    </button>

                    {index < total - 1 ? (
                        !answer.feedback ? (
                            <button
                                onClick={handleNextQuestion}
                                className={`${inter.className} text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}
                            >
                                Volgende
                            </button>
                        ) : (
                            <button
                                onClick={nextQ}
                                className={`${inter.className} text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}
                            >
                                Volgende
                            </button>
                        )
                    ) : !answer.feedback ? (
                        <button
                            onClick={handleSubmit}
                            className={`${inter.className} text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}
                        >
                            Volgende
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className={`${inter.className} text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}
                        >
                            Uitslag
                        </button>
                    )}
                </div>
            </div>

            {/* Feedback / Explanation (hidden during exam mode) */}
            {!examEnabled && answer.feedback && (
                <div className="mt-4 p-3 bg-green-50 border rounded-2xl">
                    {question.type === "multiple" &&
                        answer.response !== null &&
                        (question.choices[answer.response as number]
                            .isCorrect ? (
                            <p className="text-green-600 font-semibold flex gap-1">
                                <Image
                                    src="/q-check.svg"
                                    alt="check"
                                    width={25}
                                    height={25}
                                />{" "}
                                Correct!
                            </p>
                        ) : (
                            <p className="text-red-600 font-semibold flex gap-1">
                                <Image
                                    src="/q-wrong.svg"
                                    alt="wrong"
                                    width={25}
                                    height={25}
                                />{" "}
                                Wrong.
                            </p>
                        ))}
                    {question.type === "fill" &&
                        ((answer.response as string).trim().toLowerCase() ===
                        question.correctAnswer.trim().toLowerCase() ? (
                            <p className="text-green-600 font-semibold flex gap-1">
                                <Image
                                    src="/q-check.svg"
                                    alt="check"
                                    width={25}
                                    height={25}
                                />{" "}
                                Correct!
                            </p>
                        ) : (
                            <p className="text-red-600 font-semibold flex gap-1">
                                <Image
                                    src="/q-wrong.svg"
                                    alt="wrong"
                                    width={25}
                                    height={25}
                                />{" "}
                                Wrong.
                            </p>
                        ))}
                    <p className="text-gray-700 mt-2">{question.explanation}</p>
                </div>
            )}
        </>
    );
};

export default QuestionContent;
