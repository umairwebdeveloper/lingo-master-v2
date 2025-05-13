import Image from "next/image";

type PlatformFeature = {
    title: string;
    subtitle: string;
    image: string;
    cols?: number;
};

const features: PlatformFeature[] = [
    {
        title: "Quiz overzicht",
        subtitle: "Data-driven risk management & fraud detection.",
        image: "/landing_page/unique_platform/image_1.png",
    },
    {
        title: "Video overzicht",
        subtitle: "AI-powered diagnostics & predictive analytics.",
        image: "/landing_page/unique_platform/image_2.png",
        cols: 2,
    },
    {
        title: "Voortgangsoverzicht",
        subtitle: "Data-driven risk management & fraud detection.",
        image: "/landing_page/unique_platform/image_3.png",
    },
    {
        title: "Week streak",
        subtitle: "Data-driven risk management & fraud detection.",
        image: "/landing_page/unique_platform/image_4.png",
    },
    {
        title: "Productiviteitsgrafiek",
        subtitle: "Data-driven risk management & fraud detection.",
        image: "/landing_page/unique_platform/image_5.png",
    },
];

export default function UniquePlatform() {
    return (
        <section className="bg-gray-50">
            <div className="container mx-auto px-6 py-16">
                {/* Heading */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Ons platform is <span className="text-blue-600">uniek</span>
                </h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm p-4 ${
                                feat.cols === 2 ? "md:col-span-2" : ""
                            }`}
                        >
                            {/* For features other than first, render title/subtitle above image */}
                            {idx !== 0 && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {feat.title}
                                    </h3>
                                    <p className="mt-1 text-gray-500 text-sm">
                                        {feat.subtitle}
                                    </p>
                                </div>
                            )}

                            {/* Screenshot */}
                            <div className="rounded-lg overflow-hidden">
                                <Image
                                    src={feat.image}
                                    alt={feat.title}
                                    width={600}
                                    height={360}
                                    className="object-cover w-full h-48 md:h-56"
                                />
                            </div>

                            {/* For first feature, render title/subtitle below image */}
                            {idx === 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {feat.title}
                                    </h3>
                                    <p className="mt-1 text-gray-500 text-sm">
                                        {feat.subtitle}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
