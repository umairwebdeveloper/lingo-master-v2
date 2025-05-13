"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/progress-bar";
import { cn } from "@/lib/utils";
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


const VideoCard: React.FC<{ className?: string }> = ({ className }) => {
    const [chapter, setChapter] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get("/api/user-video/progress");
                setChapter(data);
            } catch (err: any) {
                setError(err.message || "Error fetching chapter data");
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border p-4">
                <Loader />
            </div>
        );
    }

    if (error || !chapter) {
        return <div className="p-4">Error: {error}</div>;
    }

    return (
        <div
            className={cn(
                "bg-white border flex flex-col md:flex-row",
                className
            )}
        >
            <div className="flex-1 flex flex-col justify-between">
                <div>
                     <h2 className={`${albertSans.className} text-2xl text-[#3D3D3D] font-semibold leading-normal`}>
                         Hoofdstuk 4
                    </h2>
                    <p className={`${albertSans.className} mt-[12px] mb-[12px] text-[#6D6D6D] text-[13.5px]`}>
                    Tijdens deze les ga je leren wat voorraangsborden zijn
                    </p>




                    <button
                        onClick={() => router.push("/videos")}
                        className={`${inter.className} text-[14px] font-medium bg-[#0A65FC] hover:bg-blue-600 text-white pl-6 pr-6 pt-[10px] pb-[10px] rounded-full`}
                        >
                        {chapter?.completedVideos > 0 ? "Ga verder met leren" : "Start"}{" "}
                    </button>

                    <div className="mt-[24px]">
                        <div className="flex items-center justify-between">
                        <span className={`${albertSans.className} text-[#6D6D6D] text-[14px] font-normal`}>
                                Videos: {chapter.completedVideos}/
                                {chapter.totalVideos}
                            </span>
                            <span className="text-sm text-gray-500">
                                {chapter.progress}%
                            </span>
                        </div>
                        <ProgressBar
                            progress={chapter.progress}
                            progressColor="bg-[#0A65FC]"
                            thumbColor="bg-blue-300"
                        />
                    </div>
                </div>
            </div>
            <div className="relative w-full md:w-1/2">
                <div className="h-auto w-full relative">
                    <video
                      
                        controls
                        className="rounded-xl w-full h-full object-cover"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
