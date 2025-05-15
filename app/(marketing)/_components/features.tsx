import { Check } from "lucide-react";

type Feature = {
    title: string;
    subtitle: string;
};

const features: Feature[] = [
    {
        title: "Alle CBR onderdelen",
        subtitle: "Die je nodig hebt om te slagen.",
    },
    {
        title: "Slaag in één keer",
        subtitle: "Succes gegarandeerd.",
    },
    {
        title: "Slagingsgarantie",
        subtitle: "Niet geslaagd? Geld terug!",
    },
];

export default function Features() {
    return (
        <div className="flex flex-col md:flex-row gap-5 container my-16">
            {features.map((f, i) => (
                <div
                    key={i}
                    className="flex items-center bg-blue-50 border border-blue-200 rounded-xl p-4 flex-1 transform transition-transform duration-300 hover:scale-105"
                >
                    <div className="flex-shrink-0 bg-white rounded-lg p-2">
                        <Check className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-gray-800 font-semibold">
                            {f.title}
                        </h3>
                        <p className="text-gray-500 text-sm">{f.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
