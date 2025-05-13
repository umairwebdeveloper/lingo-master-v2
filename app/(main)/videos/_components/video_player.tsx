"use client";

import React, { useState } from "react";
import axios from "axios";
import { Video } from "./snippets";

import { Albert_Sans } from '@next/font/google';
import { Inter } from '@next/font/google';



const albertSans = Albert_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400' , '500', '600']
})


interface VideoPlayerProps {
    video: Video | null;
    onVideoComplete?: (videoId: string) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    disableNext?: boolean;
    disablePrevious?: boolean;
    courseTitle?: string;
    chapterTitle?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    video,
    onVideoComplete,
    onNext,
    onPrevious,
    disableNext,
    disablePrevious,
    courseTitle,
}) => {
    const [isMarkedComplete, setIsMarkedComplete] = useState(false);

    const handleVideoEnd = async () => {
        if (!video) return;

        try {
            await axios.post("/api/user-video/complete", { videoId: video.id });
            setIsMarkedComplete(true);
            console.log(`Video ${video.id} marked as complete.`);
            if (onVideoComplete) {
                onVideoComplete(video.id);
            }
        } catch (error) {
            console.error("Failed to mark video as complete:", error);
        }
    };

    if (!video) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-xl">
                    Please select a video to start playing.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <video
                controls
                className="w-full rounded-2xl border"
                src={video.videoSrc}
                onEnded={handleVideoEnd}
            >
                Your browser does not support the video tag.
            </video>
            <div className="mt-3 flex items-center justify-between border border-gray-200 rounded-2xl p-3">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">
                        {courseTitle} : {video.title}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        className={`${inter.className} rounded-full border border-blue-500 text-blue-500 px-4 py-2 hover:bg-blue-50 transition ${
                            disablePrevious
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                        onClick={onPrevious}
                        disabled={disablePrevious}
                    >
                        Vorige
                    </button>

                    <button
                        type="button"
                        className={`${inter.className} font-medium bg-[#0A65FC] hover:bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition ${
                            disableNext ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={onNext}
                        disabled={disableNext}
                    >
                        Volgende
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
