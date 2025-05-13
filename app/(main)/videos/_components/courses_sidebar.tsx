"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import {
    getTotalCourseTime,
    getTotalChapterTime,
    isChapterComplete,
    CoursesSidebarProps,
    formatTimeMinutes,
    getChapterCompletionPercentage,
} from "./snippets";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { cn } from "@/lib/utils";
import Image from "next/image";
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

const CoursesSidebar = ({
    courses,
    activeVideo,
    setActiveVideo,
}: CoursesSidebarProps) => {
    const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>([]);

    // Automatically expand the first chapter of the first course when courses load
    useEffect(() => {
        if (
            courses.length > 0 &&
            courses[0].chapters &&
            courses[0].chapters.length > 0
        ) {
            setExpandedChapterIds([courses[0].chapters[0].id]);
        }
    }, [courses]);

    const toggleChapter = (chapterId: string) => {
        setExpandedChapterIds((prev) =>
            prev.includes(chapterId)
                ? prev.filter((id) => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    return (
        <div className="overflow-y-auto">
            {courses.map((course) => (
                <div key={course.id} className="mb-6">
                    <div className="flex items-center justify-between border border-gray-200 bg-white rounded-xl px-3 py-2 mb-3">
                        {/* Left section */}
                        <h2   className={`${albertSans.className} text-xl text-[#3D3D3D] font-medium leading-normal font-normal`}
                        >
                            {course.title}
                        </h2>

                        {/* Right section */}
                        <div className="flex space-x-2">
                            {/* Badge 1 */}
                            <div className="inline-flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                                <BookOpen className="text-gray-500 h-[18px] w-[18px] color-[#3d3d3d]" />
                                <span className={`${albertSans.className} text-[#3D3D3D] text-[16px] font-medium text-center`}>
                                    {course.chapters.length} Lesson
                                </span>
                            </div>

                            {/* Badge 2 */}
                            <div className="inline-flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1">
                                <Clock className="h-[18px] w-[18px] color-[#3d3d3d] text-gray-500" />
                                <span className={`${albertSans.className} text-[#3D3D3D] text-[16px] font-medium text-center`}>
                                    {getTotalCourseTime(course)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {course.chapters.map((chapter) => {
                        const isExpanded = expandedChapterIds.includes(
                            chapter.id
                        );
                        const percent = getChapterCompletionPercentage(chapter);
                        return (
                            <div
                                key={chapter.id}
                                className={cn(
                                    "mb-3 mt-[0px] rounded-2xl border-[#BADEFF] hover:border-blue-200",
                                    isExpanded ? "border" : "border-none"
                                )}
                            >
                                <button
                                    className={cn(
                                        "w-full flex justify-between items-center p-2 bg-[#D8ECFF] rounded-2xl hover:bg-blue-200 font-semibold mt-[-1px]",
                                        isExpanded && "rounded-b-none"
                                    )}
                                    onClick={() => toggleChapter(chapter.id)}
                                >
                                    <div className="flex items-center space-x-1">
                                        {isChapterComplete(chapter) ? (
                                            <div>
                                                <Image
                                                    src="checkmark-circle.svg"
                                                    alt="check"
                                                    width={22}
                                                    height={22}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8">
                                                <CircularProgressbar
                                                    value={percent}
                                                    text={`${Math.round(
                                                        percent
                                                    )}%`}
                                                    styles={buildStyles({
                                                        textSize: "30px",
                                                        pathColor:
                                                            percent === 100
                                                                ? "#10B981"
                                                                : "#0A65FC",
                                                        textColor: "#333",
                                                        trailColor: "#0A65FC60",
                                                    })}
                                                />
                                            </div>
                                        )}
                                        <span className={`${albertSans.className} text-[#3D3D3D] text-[16px] font-medium leading-normal text-start capitalize`}>
                                            {chapter.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="inline-flex items-center space-x-1 bg-blue-200 border border-blue-300 rounded-lg px-2 py-1">
                                            <span className={`${albertSans.className} text-[#454545] text-[13px] font-medium leading-normal`}>
                                                {chapter.videos.length} lecture
                                            </span>
                                        </div>
                                        <div className="inline-flex items-center space-x-1 bg-blue-200 border border-blue-300 rounded-lg px-2 py-1">
                                            <span className={`${albertSans.className} text-[#454545] text-[13px] font-medium leading-normal`}>
                                                {getTotalChapterTime(chapter)}
                                            </span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5" />
                                        )}
                                    </div>
                                </button>
                                {isExpanded && (
                                    <ul className="m-2">
                                        {chapter.videos.map((video) => (
                                            <li
                                                key={video.id}
                                                className={`p-2 cursor-pointer mb-2 rounded-xl hover:bg-gray-100 flex justify-between items-center ${
                                                    activeVideo?.id === video.id
                                                        ? "bg-gray-200 font-medium"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setActiveVideo(video)
                                                }
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <Image
                                                        src="video.svg"
                                                        alt="video"
                                                        width={22}
                                                        height={22}
                                                    />
                                                    <span>{video.title}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <div className="inline-flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                                                        <span className="text-xs text-blue-600 text-wrap">
                                                            {formatTimeMinutes(
                                                                video.duration
                                                            )}
                                                        </span>
                                                    </div>
                                                    {video.isCompleted && (
                                                        <div>
                                                            <Image
                                                                src="checkmark-circle.svg"
                                                                alt="check"
                                                                width={22}
                                                                height={22}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default CoursesSidebar;
