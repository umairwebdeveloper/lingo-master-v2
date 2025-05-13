import Image from "next/image";
import { Check } from "lucide-react";

const featureList = [
    "Online theorie cursus met hoogste slagingspercentage",
    "Soortgelijke CBR theorie examens oefenen",
    "Inclusief E-book en meer dan 500 oefenvragen met uitleg",
    "Altijd up-to-date met onderwerpen van het theorie examen",
    "Slagingsgarantie",
];

export default function LearningSection() {
    return (
        <section className="bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: screenshots */}
                    <div className="relative w-full">
                        <Image
                            src="/landing_page/learning_section.png"
                            alt="Video player interface op desktop"
                            width={800}
                            height={450}
                            className="rounded-xl shadow-lg"
                        />
                    </div>

                    {/* Right: copy + list + CTA */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Online leren en oefenen
                            <br />
                            voor het theorie examen
                        </h2>
                        <p className="text-gray-600">
                            Theorie leren, maar geen zin om uren uit boeken te
                            leren? Dan is onze online videocursus perfect voor
                            jou! Oefenexamens maak je online via je computer,
                            laptop, tablet of smartphone.
                        </p>

                        <ul className="space-y-4">
                            {featureList.map((feat) => (
                                <li key={feat} className="flex items-start">
                                    <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <span className="ml-3 text-gray-700">
                                        {feat}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-gray-600">
                            Maak de slimme keuze voor je theorie-examen
                            voorbereiding. Kies voor 24/7 flexibiliteit en
                            up-to-date content met TheorieBuddy! 🚀
                        </p>

                        <button className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition">
                            Bestel direct
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
