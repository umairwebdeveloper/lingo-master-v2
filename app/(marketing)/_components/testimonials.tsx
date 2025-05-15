import Image from "next/image";
import { Quote } from "lucide-react";

type Testimonial = {
    name: string;
    role: string;
    avatar: string;
    quote: string;
};

const testimonials: Testimonial[] = [
    {
        name: "David Lee",
        role: "Student",
        avatar: "/landing_page/hero/student_2.png",
        quote: "“The personalized learning path across the six services helped me stay on track and achieve my learning goals. It’s a game-changer for anyone looking to grow their knowledge in a structured and supportive environment.”",
    },
    {
        name: "Sarah Thompson",
        role: "Student",
        avatar: "/landing_page/hero/student_3.png",
        quote: "“The personalized learning path across the six services helped me stay on track and achieve my learning goals. It’s a game-changer for anyone looking to grow their knowledge in a structured and supportive environment.”",
    },
];

export default function Testimonials() {
    return (
        <section className="container mx-auto px-6 py-16">
            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Succesverhalen van onze{" "}
                    <span className="text-blue-600 underline decoration-wavy decoration-blue-600 decoration-2">
                        buddy’s
                    </span>
                </h2>
                <p className="text-gray-500 mt-2">
                    Zie wat anderen van onze cursus vinden!
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {testimonials.map((t, idx) => (
                    <div
                        key={idx}
                        className="relative bg-gray-100 p-6 rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105"
                    >
                        {/* Quote icon */}
                        <Quote className="absolute top-4 right-4 w-12 h-12 text-gray-300" />

                        {/* Header: avatar + name/role */}
                        <div className="flex items-center space-x-4">
                            <Image
                                src={t.avatar}
                                alt={t.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {t.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t.role}
                                </p>
                            </div>
                        </div>

                        {/* Quote text */}
                        <p className="mt-6 text-gray-700 leading-relaxed">
                            {t.quote}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
