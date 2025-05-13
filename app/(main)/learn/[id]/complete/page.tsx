"use client";

import React from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";

interface ActionCard {
    icon: React.ReactNode;
    title: string;
    buttonText: string;
    onClick: () => void;
}

const ExamResult: React.FC = () => {
    const params = useSearchParams();
    const { id } = useParams(); // ← grab the `[id]` from your URL
    const router = useRouter();

    const total = parseInt(params.get("total") ?? "0", 10);
    const correct = parseInt(params.get("correct") ?? "0", 10);
    const wrong = parseInt(params.get("wrong") ?? "0", 10);

    // pass threshold = 50%
    const passed = total > 0 && correct / total >= 0.5;
    const title = passed
        ? "🎉 Gefeliciteerd, je hebt het gehaald"
        : "😕 Helaas, je hebt het niet gehaald";

    // bottom cards, now using router.push
    const actionCards: ActionCard[] = [
        {
            icon: <span className="text-2xl">💪</span>,
            title: "Verbeter je score",
            buttonText: "Examen herkansen",
            onClick: () => {
                router.push(`/learn/${id}?action=start`);
            },
        },
        {
            icon: <span className="text-2xl">⏱️</span>,
            title: "Verder oefenen",
            buttonText: "Ander examen",
            onClick: () => {
                router.push(`/learn`);
            },
        },
    ];
    return (
        <div className="min-h-screen p-6 flex flex-col items-center space-y-8">
            {/* Top card */}
            <div className="w-full container bg-white rounded-3xl shadow-lg p-8 text-center space-y-4">
                <h2 className="text-2xl font-semibold">{title}</h2>

                {/* If you want a separate large emoji */}
                {!passed && <div className="text-6xl">😕</div>}
                {passed && <div className="text-6xl">🎉</div>}

                <p className="text-lg font-medium">
                    Je hebt{" "}
                    <span className="font-bold">
                        {correct} van de {total}
                    </span>{" "}
                    vragen goed beantwoord
                </p>
                <p className="text-gray-600">
                    {passed
                        ? "Je hebt genoeg punten behaald om te slagen. Goed gedaan!"
                        : "Je hebt deze keer niet genoeg punten behaald om te slagen. Bekijk je antwoorden om te zien waar je nog kunt verbeteren."}
                </p>

                <button
                    className={`mt-4 inline-block font-semibold py-2 px-6 rounded-lg transition ${
                        passed
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                    onClick={() => router.push(`/learn/${id}?action=review`)}
                >
                    {passed ? "Bekijk certificaat" : "Bekijk je antwoorden"}
                </button>

                {/* display the exam id if you like */}
                <p className="mt-2 text-sm text-gray-400">Exam ID: {id}</p>
            </div>

            {/* Bottom call-to-action */}
            <div className="w-full container bg-white space-y-4 rounded-3xl shadow-lg py-8">
                <h3 className="text-xl font-semibold">
                    Probeer het nog een keer!
                </h3>
                <p className="text-gray-600">
                    Geen zorgen met een paar extra oefenexamens zul je al snel
                    merken dat het beter gaat. Blijf gefocust en ga ervoor!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {actionCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between bg-white rounded-lg shadow-lg border p-4"
                        >
                            <div className="flex items-center space-x-3">
                                {card.icon}
                                <span className="font-medium">
                                    {card.title}
                                </span>
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-lg transition"
                                onClick={card.onClick}
                            >
                                {card.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExamResult;
