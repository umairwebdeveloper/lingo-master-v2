"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { ChevronDown, ChevronUp, Play, Pause, Eye, Clock } from "lucide-react";

interface Video {
    id: number;
    title: string;
    description: string;
    videoSrc: string;
    order: number;
}

interface Unit {
    id: number;
    title: string;
    description: string;
    courseId: number;
    order: number;
    videos: Video[];
}

type Props = {
    courseId: any;
};

const UnitsWithVideos = ({ courseId }: Props) => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
    const [selectedVideos, setSelectedVideos] = useState<
        Record<number, Video | null>
    >({});
    const [playing, setPlaying] = useState<Record<number, boolean>>({});
    const [completedVideos, setCompletedVideos] = useState<
        Record<number, boolean>
    >({});
    const [seeableVideos, setSeeableVideos] = useState<Record<number, boolean>>(
        {}
    );
    const [videoWatchTimes, setVideoWatchTimes] = useState<
        Record<number, number>
    >({});
    const [videoViews, setVideoViews] = useState<Record<number, number>>({});

    useEffect(() => {
        // Fetch units with videos
        const fetchUnits = async () => {
            try {
                setLoading(true);
                const response: any = await axios.get<Unit[]>(
                    "/api/videosChapters/" + courseId + "/"
                );
                setUnits(response.data.data.chapters);

                // Initialize selectedVideos with the first video of each unit
                const initialSelectedVideos =
                    response.data.data.chapters.reduce(
                        (acc: Record<number, Video | null>, unit: Unit) => {
                            acc[unit.id] =
                                unit.videos.length > 0 ? unit.videos[0] : null;
                            return acc;
                        },
                        {}
                    );
                setSelectedVideos(initialSelectedVideos);

                const initialSeeableVideos = response.data.data.chapters.reduce(
                    (acc: Record<number, boolean>, unit: Unit) => {
                        if (unit.videos.length > 0) {
                            acc[unit.videos[0].id] = true; // Ensure first video is always seeable
                        }
                        return acc;
                    },
                    {}
                );
                setSeeableVideos(initialSeeableVideos);
            } catch (error) {
                console.error("Error fetching units:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

    const toggleUnit = (unitId: number) => {
        setExpandedUnit((prev) => {
            const isUnitClosing = prev === unitId;

            // If unit is being opened, fetch video data for all videos in the unit
            if (!isUnitClosing) {
                const unit = units.find((u) => u.id === unitId);
                if (unit) {
                    unit.videos.forEach((video) => {
                        fetchVideoData(video.id);
                    });
                }
            }

            return isUnitClosing ? null : unitId;
        });
    };

    const selectVideo = (unitId: number, video: Video) => {
        setSelectedVideos((prev) => ({ ...prev, [unitId]: video }));
        fetchVideoData(video.id);
    };

    const navigateVideo = (unitId: number, direction: "prev" | "next") => {
        const currentVideo = selectedVideos[unitId];
        if (!currentVideo) return;

        const unit = units.find((u) => u.id === unitId);
        if (!unit || !unit.videos.length) return;

        const currentIndex = unit.videos.findIndex(
            (v) => v.id === currentVideo.id
        );
        if (direction === "prev" && currentIndex > 0) {
            selectVideo(unitId, unit.videos[currentIndex - 1]);
        } else if (
            direction === "next" &&
            currentIndex < unit.videos.length - 1
        ) {
            selectVideo(unitId, unit.videos[currentIndex + 1]);
        }
    };

    const fetchVideoData = async (videoId: number) => {
        try {
            const response = await axios.get(
                `/api/user-video/?videoId=${videoId}`
            );
            const { views, isCompleted, watchTime } = response.data.data;

            // Update state with the fetched data
            setVideoViews((prev) => ({
                ...prev,
                [videoId]: views,
            }));

            setCompletedVideos((prev) => ({
                ...prev,
                [videoId]: isCompleted,
            }));

            setVideoWatchTimes((prev) => ({
                ...prev,
                [videoId]: watchTime,
            }));

            console.log("Video data fetched:", response.data);

            // Make the companion video seeable if the current video is completed
            if (isCompleted) {
                const unit = units.find((u) =>
                    u.videos.some((video) => video.id === videoId)
                );
                if (unit) {
                    const currentIndex = unit.videos.findIndex(
                        (video) => video.id === videoId
                    );
                    if (currentIndex < unit.videos.length - 1) {
                        const nextVideoId = unit.videos[currentIndex + 1].id;
                        setSeeableVideos((prev) => ({
                            ...prev,
                            [nextVideoId]: true,
                        }));
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching video data:", error);
        }
    };

    const updateVideoData = async (videoId: number, unitId: number) => {
        try {
            const payload = {
                videoId,
                unitId,
                views: videoViews[videoId] || 0,
                isCompleted: completedVideos[videoId] || false,
                watchTime: videoWatchTimes[videoId] || 0,
            };

            await axios.post("/api/user-video", payload);
            console.log("Video data updated:", payload);
        } catch (error) {
            console.error("Error updating video data:", error);
        }
    };

    const handleProgress = (unitId: number, progress: any) => {
        const currentVideoId = selectedVideos[unitId]?.id || 0;

        // Update watch time
        setVideoWatchTimes((prev) => ({
            ...prev,
            [currentVideoId]: (prev[currentVideoId] || 0) + 1, // Increment watch time in seconds
        }));

        // Mark video as completed if played >= 95%
        if (progress.played >= 0.95) {
            setCompletedVideos((prev) => ({
                ...prev,
                [currentVideoId]: true,
            }));

            setVideoViews((prev) => {
                if (!prev[currentVideoId]) {
                    return { ...prev, [currentVideoId]: 1 };
                }
                return {
                    ...prev,
                    [currentVideoId]: prev[currentVideoId] + 1,
                };
            });

            updateVideoData(currentVideoId, unitId);

            // Enable the next video
            const unit = units.find((u) => u.id === unitId);
            if (unit) {
                const currentIndex = unit.videos.findIndex(
                    (v) => v.id === currentVideoId
                );
                if (currentIndex < unit.videos.length - 1) {
                    const nextVideoId = unit.videos[currentIndex + 1].id;
                    setSeeableVideos((prev) => ({
                        ...prev,
                        [nextVideoId]: true,
                    }));
                }
            }
        }
    };

    const togglePlayPause = (unitId: number) => {
        setPlaying((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
    };

    const handlePlay = (unitId: number) => {
        setPlaying((prev) => ({ ...prev, [unitId]: true }));
    };

    const handlePause = (unitId: number) => {
        setPlaying((prev) => ({ ...prev, [unitId]: false }));

        const currentVideoId = selectedVideos[unitId]?.id || 0;
        if (currentVideoId) {
            updateVideoData(currentVideoId, unitId);
        }
    };

    const formatWatchTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="container max-w-[1650px] px-3 md:px-6">
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : units.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No chapters found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className="border rounded-3xl shadow-md p-4"
                        >
                            <div
                                className="flex justify-between items-center cursor-pointer bg-blue-500 text-white p-4 rounded-lg"
                                onClick={() => toggleUnit(unit.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-xl font-semibold">
                                        {unit.title}
                                    </h2>
                                </div>
                                <button className="text-white flex items-center space-x-2">
                                    <span>
                                        {expandedUnit === unit.id
                                            ? "Collapse"
                                            : "Expand"}
                                    </span>
                                    {expandedUnit === unit.id ? (
                                        <ChevronUp />
                                    ) : (
                                        <ChevronDown />
                                    )}
                                </button>
                            </div>
                            {expandedUnit === unit.id && (
                                <div className="mt-4 flex space-x-4">
                                    <div className="w-3/4">
                                        {selectedVideos[unit.id] ? (
                                            <div>
                                                <div className="rounded-3xl shadow-md overflow-hidden border">
                                                    <ReactPlayer
                                                        url={
                                                            selectedVideos[
                                                                unit.id
                                                            ]?.videoSrc
                                                        }
                                                        playing={
                                                            playing[unit.id] ||
                                                            false
                                                        }
                                                        controls
                                                        width="100%"
                                                        height="360px"
                                                        onPlay={() =>
                                                            handlePlay(unit.id)
                                                        }
                                                        onPause={() =>
                                                            handlePause(unit.id)
                                                        }
                                                        onProgress={(
                                                            progress
                                                        ) =>
                                                            handleProgress(
                                                                unit.id,
                                                                progress
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="rounded-3xl shadow-md border p-4 mt-4">
                                                    <h3 className="text-lg font-medium">
                                                        {
                                                            selectedVideos[
                                                                unit.id
                                                            ]?.title
                                                        }
                                                    </h3>
                                                    <div className="flex justify-between mt-3">
                                                        <button
                                                            className="bg-gray-200 px-4 py-2 rounded-full"
                                                            onClick={() =>
                                                                togglePlayPause(
                                                                    unit.id
                                                                )
                                                            }
                                                        >
                                                            {playing[
                                                                unit.id
                                                            ] ? (
                                                                <Pause className="inline" />
                                                            ) : (
                                                                <Play className="inline" />
                                                            )}{" "}
                                                            {playing[unit.id]
                                                                ? "Pause"
                                                                : "Play"}
                                                        </button>
                                                        <div className="space-x-2">
                                                            <button
                                                                className="bg-gray-200 px-4 py-2 rounded-full disabled:opacity-50"
                                                                onClick={() =>
                                                                    navigateVideo(
                                                                        unit.id,
                                                                        "prev"
                                                                    )
                                                                }
                                                                disabled={
                                                                    unit.videos.findIndex(
                                                                        (v) =>
                                                                            v.id ===
                                                                            selectedVideos[
                                                                                unit
                                                                                    .id
                                                                            ]
                                                                                ?.id
                                                                    ) === 0
                                                                }
                                                            >
                                                                Previous
                                                            </button>
                                                            <button
                                                                className="bg-gray-200 px-4 py-2 rounded-full disabled:opacity-50"
                                                                onClick={() =>
                                                                    navigateVideo(
                                                                        unit.id,
                                                                        "next"
                                                                    )
                                                                }
                                                                disabled={
                                                                    !selectedVideos[
                                                                        unit.id
                                                                    ] ||
                                                                    !seeableVideos[
                                                                        unit
                                                                            .videos[
                                                                            unit.videos.findIndex(
                                                                                (
                                                                                    v
                                                                                ) =>
                                                                                    v.id ===
                                                                                    selectedVideos[
                                                                                        unit
                                                                                            .id
                                                                                    ]
                                                                                        ?.id
                                                                            ) +
                                                                                1
                                                                        ]?.id
                                                                    ] ||
                                                                    unit.videos.findIndex(
                                                                        (v) =>
                                                                            v.id ===
                                                                            selectedVideos[
                                                                                unit
                                                                                    .id
                                                                            ]
                                                                                ?.id
                                                                    ) ===
                                                                        unit
                                                                            .videos
                                                                            .length -
                                                                            1
                                                                }
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                No video selected.
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className="w-1/4 border-l px-4 shadow-md rounded-3xl py-3"
                                        style={{
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">
                                                Chapters{" "}
                                            </h3>
                                            <span>
                                                {unit.videos.length} lessions
                                            </span>
                                        </div>
                                        <ul className="space-y-2">
                                            {unit.videos.map((video, index) => (
                                                <li
                                                    key={video.id}
                                                    className={`cursor-pointer p-2 rounded-3xl ${
                                                        selectedVideos[unit.id]
                                                            ?.id === video.id
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-100 text-gray-700"
                                                    } ${
                                                        !seeableVideos[
                                                            video.id
                                                        ] && index !== 0 // Allow the first video
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        (seeableVideos[
                                                            video.id
                                                        ] ||
                                                            index === 0) &&
                                                        selectVideo(
                                                            unit.id,
                                                            video
                                                        )
                                                    }
                                                >
                                                    <div className="flex g-2 justify-between items-center">
                                                        {video.title}{" "}
                                                        <span
                                                            className={`${
                                                                selectedVideos[
                                                                    unit.id
                                                                ]?.id ===
                                                                video.id
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-100 text-gray-700"
                                                            } flex items-center`}
                                                            title="watch time"
                                                        >
                                                            <Clock className="w-4 h-4 mr-1" />{" "}
                                                            {formatWatchTime(
                                                                videoWatchTimes[
                                                                    video.id
                                                                ] || 0
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex g-2 justify-between items-center">
                                                        <span
                                                            className={`${
                                                                selectedVideos[
                                                                    unit.id
                                                                ]?.id ===
                                                                video.id
                                                                    ? "bg-blue-500 text-white"
                                                                    : "bg-gray-100 text-gray-700"
                                                            } flex items-center`}
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            {videoViews[
                                                                video.id
                                                            ] || 0}
                                                        </span>
                                                        {completedVideos[
                                                            video.id
                                                        ] && (
                                                            <span className="text-green-500 ml-2">
                                                                Completed ✔
                                                            </span> // Completed Icon
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UnitsWithVideos;
