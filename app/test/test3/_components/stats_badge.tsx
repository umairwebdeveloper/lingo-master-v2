// components/StatsBadge.tsx
import React from "react";
import { Users, Book } from "lucide-react";

interface StatsBadgeProps {
    fullWidth?: boolean;
}

export const StatsBadge: React.FC<StatsBadgeProps> = ({ fullWidth = true }) => {
    return (
        <div
            className={[
                fullWidth
                    ? "flex w-full rounded-2xl"
                    : "inline-flex rounded-xl",
                "bg-blue-50 p-1",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {/* 1st card */}
            <div className="rounded-lg flex-1 px-6 py-3 flex flex-col items-center">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="mt-2 text-2xl font-bold text-gray-900">
                    1,000+
                </span>
                <span className="mt-1 text-sm text-gray-600">Geslaagden</span>
            </div>

            {/* spacing */}
            <div className="w-8" />

            {/* 2nd card */}
            <div className="rounded-lg flex-1 px-6 py-3 flex flex-col items-center">
                <Book className="w-6 h-6 text-blue-600" />
                <span className="mt-2 text-2xl font-bold text-gray-900">
                    500+
                </span>
                <span className="mt-1 text-sm text-gray-600">oefenvragen</span>
            </div>
        </div>
    );
};
