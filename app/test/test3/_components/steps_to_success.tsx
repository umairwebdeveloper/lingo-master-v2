import { User, Send, TrendingUp, CheckSquare } from "lucide-react";

type Step = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

const steps: Step[] = [
    {
        id: "01",
        title: "Aanmelden",
        description: "Kies een pakket en maak een account aan.",
        icon: <User className="w-8 h-8 text-blue-600" />,
    },
    {
        id: "02",
        title: "Begin met leren",
        description: "Bekijk videolessen en maak oefenexamens.",
        icon: <Send className="w-8 h-8 text-blue-600" />,
    },
    {
        id: "03",
        title: "Volg je voortgang",
        description: "Ontdek je zwakke punten en verbeter ze.",
        icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
    },
    {
        id: "04",
        title: "Slaag voor je examen",
        description: "Wees volledig voorbereid op het CBR-examen.",
        icon: <CheckSquare className="w-8 h-8 text-blue-600" />,
    },
];

export default function StepsToSuccess() {
    return (
        <section className="bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    In 4 stappen{" "}
                    <span className="text-blue-600 underline decoration-wavy decoration-blue-600 decoration-2">
                        slagen!
                    </span>
                </h2>

                {/* Steps grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {steps.map((step, idx) => {
                        // Add top margin for 1st & 3rd, bottom margin for 2nd & 4th
                        const spacingClass = idx % 2 === 0 ? "md:mb-10" : "md:mt-10";
                        return (
                            <div
                                key={step.id}
                                className={`relative border border-dashed border-blue-300 rounded-xl p-6 ${spacingClass}`}
                            >
                                {/* Icon */}
                                <div className="absolute top-4 right-4 bg-blue-50 p-2 rounded-lg">
                                    {step.icon}
                                </div>

                                {/* Number */}
                                <p className="text-3xl font-bold">{step.id}</p>

                                {/* Title */}
                                <h3 className="mt-2 text-lg font-semibold">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-1 text-gray-600 text-sm">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
