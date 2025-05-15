import { useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = {
    question: string;
    answer: string;
};

type FaqCategory = {
    id: string;
    title: string;
    items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
    {
        id: "general",
        title: "General Questions",
        items: [
            {
                question: "What is the location of the nature cottage?",
                answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
            {
                question: "What amenities are available at the cottage?",
                answer: "There’s a full kitchen, Wi-Fi, fireplace, and private parking.",
            },
            {
                question: "What activities are available nearby?",
                answer: "Hiking, fishing, mountain biking, and guided tours.",
            },
            {
                question: "How can I make a reservation?",
                answer: "Just click “Book now” on our site and follow the steps!",
            },
        ],
    },
    {
        id: "booking",
        title: "Booking & Payments",
        items: [
            {
                question: "What payment methods do you accept?",
                answer: "We accept Visa, MasterCard, and PayPal.",
            },
            {
                question: "Can I cancel my booking?",
                answer: "Yes—up to 48h before arrival for a full refund.",
            },
            {
                question: "Is there a deposit?",
                answer: "A €100 security deposit is held and returned on check-out.",
            },
            {
                question: "Do you offer group discounts?",
                answer: "Groups of 5+ get 10% off—just contact us directly.",
            },
        ],
    },
];

export default function Faq() {
    // track open panels by "category-index" key
    const [openPanels, setOpenPanels] = useState<Record<string, boolean>>(() =>
        faqCategories.reduce((acc, cat) => {
            cat.items.forEach((_, idx) => {
                // open only the first item of each category
                acc[`${cat.id}-${idx}`] = idx === 0;
            });
            return acc;
        }, {} as Record<string, boolean>)
    );

    const toggle = (key: string) =>
        setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <section className="container mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">
                Veelgestelde vragen
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {faqCategories.map((cat) => (
                    <div key={cat.id}>
                        <h3 className="text-xl font-semibold mb-4">
                            {cat.title}
                        </h3>
                        <div>
                            {cat.items.map((item, idx) => {
                                const key = `${cat.id}-${idx}`;
                                const isOpen = openPanels[key];

                                return (
                                    <div key={key} className="mb-4">
                                        <button
                                            onClick={() => toggle(key)}
                                            className={`flex w-full justify-between items-center p-4 border rounded-lg transition ${
                                                isOpen
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span className="text-left">
                                                {item.question}
                                            </span>
                                            {isOpen ? (
                                                <Minus className="w-5 h-5" />
                                            ) : (
                                                <Plus className="w-5 h-5" />
                                            )}
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all ${
                                                isOpen ? "max-h-96" : "max-h-0"
                                            }`}
                                        >
                                            <div className="p-4 border border-t-0 border-gray-200 bg-white rounded-b-lg">
                                                <p className="text-gray-600">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
