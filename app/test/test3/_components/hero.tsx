import Image from "next/image";
import { Check, Users, FileText } from "lucide-react";


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

            <div className="relative container mx-auto px-6 pt-32 md:pb-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
                        <Image
                            src={"/landing_page/hero/side_image_3.png"}
                            alt={"Mobile screenshot 2"}
                            width={100}
                            height={100}
                            className="rounded-lg mb-4"
                        />
                        <Image
                            src={"/landing_page/hero/side_image_2.png"}
                            alt={"Mobile screenshot 1"}
                            width={500}
                            height={500}
                            className="rounded-lg"
                        />
                    </div>

                    {/* Desktop: single large illustration */}
                    <div className="hidden md:flex w-full">
                        <Image
                            src="/landing_page/hero/side_image.png"
                            alt="TheorieBuddy Logo"
                            width={800}
                            height={800}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
