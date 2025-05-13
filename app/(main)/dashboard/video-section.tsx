import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import Link from "next/link";


const VideoSection: React.FC = () => {
    const [videoData, setVideoData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Replace with your API endpoint
        const fetchVideoData = async () => {
            try {
                const response = await axios.get("/api/user-video/progress"); // Update with your actual endpoint

                setVideoData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching video data:", error);
                setIsLoading(false);
            }
        };

        fetchVideoData();
    }, []);

    return (
        <div className="border-2 rounded-xl p-4 space-y-4 col-span-1">
            <div className="flex space-x-4">
                <div className="flex-1">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div>
                                <h2 className="text-xl font-bold title">
                                    {videoData.lastWatchedVideo.title}
                                </h2>
                                <p className="text-gray-600 description">
                                    {videoData.lastWatchedVideo.description}
                                </p>
                                <Link href={"/videos"}>
                                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
                                        Continue Learning →
                                    </button>
                                </Link>
                            </div>
                            <div style={{ marginTop: "6.5rem" }}>
                                <div className="flex justify-between items-center w-100">
                                    <span>
                                        Chapter {videoData.completedVideos} by{" "}
                                        {videoData.totalVideos}
                                    </span>
                                    <span>{videoData.progress}%</span>
                                </div>
                                <div className="bg-gray-200 rounded-full">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${videoData.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {!isLoading && videoData.lastWatchedVideo.videoSrc ? (
                    <div className="rounded-lg shadow-md overflow-hidden border">
                        <ReactPlayer
                            url={videoData.lastWatchedVideo.videoSrc}
                            controls
                            width="100%"
                            height="250px"
                        />
                    </div>
                ) : (
                    <p>Loading video...</p>
                )}
            </div>
        </div>
    );
};

export default VideoSection;
