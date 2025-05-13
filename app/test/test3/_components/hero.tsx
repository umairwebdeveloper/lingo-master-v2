import Image from "next/image";
import { Check, Users, FileText } from "lucide-react";
import { AvatarBadge } from "./avatar_badge";
import { StatsBadge } from "./stats_badge";

export default function Hero() {
    return (
        <section
            id="heroSection"
            className="relative bg-gray-50 rounded-b-3xl overflow-hidden "
        >
            {/* Decorative background */}
            <div className="absolute inset-0 pointer-events-none">
                <Image
                    src="/landing_page/hero/road.png"
                    alt=""
                    layout="fill"
                    objectFit="cover"
                    className=""
                />
            </div>

            <div className="relative container mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-36 items-center">
                {/* Left */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl text-center md:text-start font-bold leading-tight">
                        <span className="text-blue-600">Slagen</span> voor je
                        theorie-examen met{" "}
                        <span className="text-blue-600 md:text-6xl">
                            TheorieBuddy!
                        </span>
                    </h1>
                    <p className="text-gray-600 max-w-prose text-center md:text-start">
                        Snel en effectief je theorie? Onze online cursus en
                        oefenexamens bereiden je perfect voor op het CBR-examen.
                        Zo slaag jij in één keer!
                    </p>

                    {/* Features */}
                    <ul className="space-y-3">
                        {[
                            "Hoogste slagingspercentage",
                            "Meer dan 500 oefenvragen",
                            "Niet geslaagd? Geld terug!",
                        ].map((text) => (
                            <li key={text} className="flex items-start">
                                <Check className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <span className="ml-2 text-gray-700">
                                    {text}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 flex justify-center md:justify-start">
                        <button className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition">
                            Bestel direct!
                        </button>
                    </div>
                </div>

                {/* Right illustration */}
                <div className="flex justify-center">
                    {/* Mobile: two small images */}
                    <div className="flex flex-col items-center space-x-4 md:hidden">
                        <div className="mb-3">
                            <AvatarBadge
                                images={[
                                    "/landing_page/hero/student_1.png",
                                    "/landing_page/hero/student_2.png",
                                    "/landing_page/hero/student_3.png",
                                    "/landing_page/hero/student_4.png",
                                ]}
                                showLabel={false}
                            />
                        </div>
                        <div className="relative">
                            <Image
                                src={"/landing_page/hero/side_image_4.png"}
                                alt={"Mobile screenshot 1"}
                                width={500}
                                height={500}
                                className="rounded-lg"
                            />
                            <div className="absolute inset-x-0 -bottom-16">
                                <StatsBadge />
                            </div>
                        </div>
                    </div>

                    {/* Desktop: single large illustration */}
                    <div className="relative hidden md:flex w-full">
                        <Image
                            src="/logos/half_logo.svg"
                            alt="TheorieBuddy Logo"
                            width={500}
                            height={500}
                            className="object-contain"
                        />
                        <div className="absolute bottom-0 -left-12">
                            <AvatarBadge
                                images={[
                                    "/landing_page/hero/student_1.png",
                                    "/landing_page/hero/student_2.png",
                                    "/landing_page/hero/student_3.png",
                                ]}
                            />
                        </div>
                        <div className="absolute bottom-2 right-0">
                            <StatsBadge fullWidth={false} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
