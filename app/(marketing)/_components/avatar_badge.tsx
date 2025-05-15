// components/AvatarBadge.tsx
import React from "react";

interface AvatarBadgeProps {
    images: string[];
    /** show the “1K+ Student” label and white pill background */
    showLabel?: boolean;
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
    images,
    showLabel = true,
}) => {
    return (
        <div
            className={[
                "inline-flex items-center rounded-full p-1",
                showLabel && "bg-white shadow-lg",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {/* overlapping avatars */}
            <div className="flex -space-x-3">
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Avatar ${idx + 1}`}
                        className="w-10 h-10 rounded-full border-4 border-white object-cover"
                    />
                ))}
            </div>

            {/* label */}
            {showLabel && (
                <span className="ml-3 mr-2 text-sm font-bold text-gray-800 leading-tight">
                    1K+ <br /> Student
                </span>
            )}
        </div>
    );
};
