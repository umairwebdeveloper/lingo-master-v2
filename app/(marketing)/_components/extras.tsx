import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Extra = {
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
    imageSrc: string;
    imageAlt: string;
    size: number;
};

const extras: Extra[] = [
    {
        title: "Urgent package",
        description:
            "Last minute still pass? Take the Accelerated package! 24 hours unlimited learning from €29.99.",
        linkText: "Order now",
        linkHref: "/order/urgent",
        imageSrc: "/landing_page/extras/image_1.svg",
        imageAlt: "Bell icon with notification",
        size: 250,
    },
    {
        title: "Want to give a theory course as a gift?",
        description:
            "The best gift for anyone who wants to pass the theory exam!",
        linkText: "The best gift to give",
        linkHref: "#",
        imageSrc: "/landing_page/extras/image_2.svg",
        imageAlt: "Wrapped gift icon",
        size: 130,
    },
    {
        title: "Contact",
        description:
            "Do you have a question? We are here for you. Call us on: 020 261 7438 or send a message to 06 18 99 20 69 or email: slagen@theoriebuddy.nl",
        linkText: "Contact",
        linkHref: "#",
        imageSrc: "/landing_page/extras/image_3.svg",
        imageAlt: "Chat bubbles icon",
        size: 140,
    },
];

export default function Extras() {
    return (
        <section className="container mx-auto px-6 py-16">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Handige extra’s van{" "}
                <span className="text-blue-600">Theoriebuddy</span>
            </h2>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {extras.map((ex, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col border bg-white rounded-2xl p-6 shadow-sm h-full transform transition-transform duration-300 hover:scale-105"
                    >
                        {/* Icon */}
                        <div className="flex justify-center">
                            <Image
                                src={ex.imageSrc}
                                alt={ex.imageAlt}
                                width={ex.size}
                                height={ex.size}
                                className="object-contain"
                            />
                        </div>

                        {/* Title */}
                        <h3 className="mt-6 text-lg font-semibold text-gray-800">
                            {ex.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-gray-600 flex-1">
                            {ex.description}
                        </p>

                        {/* Link */}
                        <a
                            href={ex.linkHref}
                            className="mt-4 inline-flex items-center text-blue-600 font-medium hover:underline"
                        >
                            {ex.linkText}
                            <ArrowRight className="ml-1 w-4 h-4" />
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
