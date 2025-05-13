"use client";

import React from "react";

interface ActionCard {
    icon: React.ReactNode;
    title: string;
    buttonText: string;
    onClick: () => void;
}

const actionCards: ActionCard[] = [
    {
        icon: <span className="text-2xl">💪</span>,
        title: "Verbeter je score",
        buttonText: "Examen herkansen",
        onClick: () => {
            console.log("Herkansingsflow starten");
        },
    },
    {
        icon: <span className="text-2xl">⏱️</span>,
        title: "Verder oefenen",
        buttonText: "Ander examen",
        onClick: () => {
            console.log("Naar ander examen");
        },
    },
];

const ExamResult: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center space-y-8">
            {/* Top card */}
            <div className="w-full container bg-white rounded-3xl shadow-lg p-8 text-center space-y-4">
                <h2 className="text-2xl font-semibold">
                    Helaas, je hebt het niet gehaald
                </h2>
                <div className="text-6xl">😕</div>
                <p className="text-lg font-medium">
                    Je hebt <span className="font-bold">0 van de 50</span>{" "}
                    vragen goed beantwoord
                </p>
                <p className="text-gray-600">
                    Je hebt deze keer niet genoeg punten behaald om te slagen.
                    Bekijk je antwoorden om te zien waar je nog kunt verbeteren.
                </p>
                <button
                    className="mt-4 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                    onClick={() => console.log("Bekijk antwoorden")}
                >
                    Bekijk je antwoorden
                </button>
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
