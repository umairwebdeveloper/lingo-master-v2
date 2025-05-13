import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function ReadyToPass() {
    return (
        <section className="relative bg-blue-600 text-white overflow-hidden">
            {/* Decorative road pattern */}
            <div className="absolute inset-0">
                <Image
                    src="/landing_page/hero/road_2.png"
                    alt="Road background pattern"
                    fill
                    style={{ objectFit: "cover" }}
                    className="pointer-events-none"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                    Klaar om te slagen voor je theorie-examen?
                </h2>
                <p className="text-lg md:text-xl mb-8">
                    Start vandaag met TheorieBuddy
                </p>
                <a className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition">
                    Bestel direct!
                </a>
            </div>
        </section>
    );
}
