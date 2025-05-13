import React from "react";

interface ProgressBarProps {
    progress: number; // expected value between 0 and 100
    bgColor?: string; // Tailwind CSS class for background color (default: bg-gray-200)
    progressColor?: string; // Tailwind CSS class for filled progress (default: bg-green-500)
    thumbColor?: string; // Tailwind CSS class for thumb background (default: bg-white)
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    bgColor = "bg-gray-200",
    progressColor = "bg-blue-500",
    thumbColor = "bg-blue-300",
}) => {
    return (
        <div className={`relative w-full ${bgColor} h-2 rounded-full mt-2`}>
            <div
                className={`${progressColor} h-2 rounded-full`}
                style={{ width: `${progress}%` }}
            ></div>
            <div
                className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 ${thumbColor} border border-gray-100 rounded-full h-4 w-4`}
                style={{ left: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
