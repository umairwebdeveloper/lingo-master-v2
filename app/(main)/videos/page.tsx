"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CoursesSidebar from "./_components/courses_sidebar";
import VideoPlayer from "./_components/video_player";
import { Course, Video } from "./_components/snippets";
import Loader from "@/components/loader";

const CoursesPage = () => {
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get("/api/videos/chapter_videos");
                setCourses(data);
                // Automatically select the first video of the first chapter of the first course
                if (
                    data &&
                    data.length > 0 &&
                    data[0].chapters &&
                    data[0].chapters.length > 0 &&
                    data[0].chapters[0].videos &&
                    data[0].chapters[0].videos.length > 0
                ) {
                    setActiveVideo(data[0].chapters[0].videos[0]);
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleVideoComplete = (videoId: string) => {
        setActiveVideo((prev) =>
            prev && prev.id === videoId ? { ...prev, isCompleted: true } : prev
        );
        setCourses((prevCourses) =>
            prevCourses.map((course) => ({
                ...course,
                chapters: course.chapters.map((chapter) => ({
                    ...chapter,
                    videos: chapter.videos.map((video: Video) =>
                        video.id === videoId
                            ? { ...video, isCompleted: true }
                            : video
                    ),
                })),
            }))
        );
    };

    // Handler for "Next" button
    const handleNextVideo = () => {
        if (!activeVideo) return;
        for (let course of courses) {
            for (let chapter of course.chapters) {
                const idx = chapter.videos.findIndex(
                    (video: Video) => video.id === activeVideo.id
                );
                if (idx !== -1) {
                    if (idx < chapter.videos.length - 1) {
                        setActiveVideo(chapter.videos[idx + 1]);
                    }
                    return;
                }
            }
        }
    };

    // Handler for "Previous" button
    const handlePreviousVideo = () => {
        if (!activeVideo) return;
        for (let course of courses) {
            for (let chapter of course.chapters) {
                const idx = chapter.videos.findIndex(
                    (video: Video) => video.id === activeVideo.id
                );
                if (idx !== -1) {
                    if (idx > 0) {
                        setActiveVideo(chapter.videos[idx - 1]);
                    }
                    return;
                }
            }
        }
    };

    // Determine whether to disable navigation buttons
    let disableNext = false;
    let disablePrevious = false;
    if (activeVideo) {
        for (let course of courses) {
            for (let chapter of course.chapters) {
                const idx = chapter.videos.findIndex(
                    (video: Video) => video.id === activeVideo.id
                );
                if (idx !== -1) {
                    disablePrevious = idx === 0;
                    disableNext = idx === chapter.videos.length - 1;
                    break;
                }
            }
        }
    }

    // Determine the current course and chapter for the active video
    let currentCourseTitle = "";
    let currentChapterTitle = "";
    if (activeVideo) {
        for (let course of courses) {
            for (let chapter of course.chapters) {
                const found = chapter.videos.find(
                    (video: Video) => video.id === activeVideo.id
                );
                if (found) {
                    currentCourseTitle = course.title;
                    currentChapterTitle = chapter.title;
                    break;
                }
            }
            if (currentCourseTitle) break;
        }
    }

    if (loading) {
        return (
            <div className="container p-4">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div className="container p-4">Error: {error}</div>;
    }

    return (
        <div className="container px-3 md:px-6 max-w-[1650px] pb-5 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-4">
                <div className="col-span-2">
                    <VideoPlayer
                        video={activeVideo}
                        onVideoComplete={handleVideoComplete}
                        onNext={handleNextVideo}
                        onPrevious={handlePreviousVideo}
                        disableNext={disableNext}
                        disablePrevious={disablePrevious}
                        courseTitle={currentCourseTitle}
                        chapterTitle={currentChapterTitle}
                    />
                </div>
                <div>
                    <CoursesSidebar
                        courses={courses}
                        activeVideo={activeVideo}
                        setActiveVideo={setActiveVideo}
                    />
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
