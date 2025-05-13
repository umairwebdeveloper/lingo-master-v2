// components/Pricing.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

type Package = {
    id: string;
    title: string;
    days: number;
    modules: number;
    price: string;
    image: string;
    recommended?: boolean;
};

const packages: Package[] = [
    {
        id: "basis",
        title: "Auto – Basis",
        days: 14,
        modules: 4,
        price: "29,99",
        image: "/landing_page/pricing/image_1.png",
    },
    {
        id: "expert",
        title: "Auto – Expert",
        days: 31,
        modules: 10,
        price: "49,99",
        image: "/landing_page/pricing/image_2.png",
        recommended: true,
    },
    {
        id: "gevorderd",
        title: "Auto – Gevorderd",
        days: 21,
        modules: 7,
        price: "39,99",
        image: "/landing_page/pricing/image_3.png",
    },
];

export default function Pricing() {
    const [selected, setSelected] = useState<string>("expert");

    return (
        <section className="container mx-auto px-6 py-16">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-center">
                Kies je <span className="text-blue-600">pakket!</span>
            </h2>

            {/* Category pills */}
            <div className="flex justify-center my-6">
                <button className="px-5 py-2 rounded-full border border-blue-600 text-blue-600">
                    Auto
                </button>
            </div>

            {/* Package cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                    const isSel = selected === pkg.id;
                    return (
                        <div
                            key={pkg.id}
                            onClick={() => setSelected(pkg.id)}
                            className={`relative flex flex-col border rounded-2xl overflow-hidden cursor-pointer transition ${
                                isSel
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-200 bg-white hover:shadow-lg"
                            }`}
                        >
                            {/* Badge */}
                            {pkg.recommended && (
                                <span className="absolute top-4 right-4 bg-green-100 text-green-800 font-semibold px-3 py-2 border rounded-full">
                                    Aanbevolen
                                </span>
                            )}

                            {/* Image */}
                            <div className="p-6 flex justify-center">
                                <Image
                                    src={pkg.image}
                                    alt={pkg.title}
                                    width={400}
                                    height={400}
                                    className="object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="px-6 flex-1">
                                <h3 className="text-lg font-semibold mb-4">
                                    {pkg.title}
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="ml-3 text-gray-700">
                                            {pkg.days} dagen toegang
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span className="ml-3 text-gray-700">
                                            {pkg.modules} CBR exammodules
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Divider */}
                            <hr className="border-dashed border-blue-600 mx-6 mt-6" />

                            {/* Price + Radio */}
                            <div className="px-6 py-4 flex items-center justify-between">
                                <span className="text-2xl font-bold">
                                    € {pkg.price}
                                </span>
                                <input
                                    type="radio"
                                    name="package"
                                    value={pkg.id}
                                    checked={isSel}
                                    onChange={() => setSelected(pkg.id)}
                                    className="w-5 h-5 text-blue-600"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Global features */}
            <div className="mt-12 flex flex-wrap justify-center gap-8">
                {[
                    "500 oefenvragen",
                    "Verkeersbegrippen",
                    "Uitleg",
                    "24/7 support",
                ].map((feat) => (
                    <div
                        key={feat}
                        className="flex items-center space-x-2 text-gray-700"
                    >
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>{feat}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition">
                    Bestel direct!
                </button>
            </div>
        </section>
    );
}
