// pages/api/videos/by-chapter.ts

import db from "@/db/drizzle";
import { courses, videoChapters, videos, userVideos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
    try {
        // Extract userId from query parameters (if provided)
        const { userId } = auth();

        // Fetch all courses, chapters, and videos
        const allCourses = await db.select().from(courses);
        const allChapters = await db.select().from(videoChapters);
        const allVideos = await db.select().from(videos);

        // If a userId is provided, fetch their video completion records.
        let userVideoRecords: any[] = [];
        if (userId) {
            userVideoRecords = await db
                .select()
                .from(userVideos)
                .where(eq(userVideos.userId, userId));
        }

        // Create a mapping from videoId to its completion status.
        const videoCompletionMap: Record<number, boolean> = {};
        userVideoRecords.forEach((record) => {
            videoCompletionMap[record.videoId] = record.isCompleted;
        });

        // Group chapters by courseId.
        const chaptersByCourse = allChapters.reduce((acc, chapter: any) => {
            if (!acc[chapter.courseId]) {
                acc[chapter.courseId] = [];
            }
            acc[chapter.courseId].push(chapter);
            return acc;
        }, {} as Record<number, any[]>);

        // Group videos by chapterId and add the isCompleted field.
        const videosByChapter = allVideos.reduce((acc, video: any) => {
            // Determine if the video is completed (default to false).
            const isCompleted = videoCompletionMap[video.id] || false;
            const videoWithCompletion = { ...video, isCompleted };

            if (!acc[video.chapterId]) {
                acc[video.chapterId] = [];
            }
            acc[video.chapterId].push(videoWithCompletion);
            return acc;
        }, {} as Record<number, any[]>);

        // Compose the final result by nesting chapters (with their videos) within courses.
        const coursesWithDetails = allCourses.map((course: any) => {
            const chapters = (chaptersByCourse[course.id] || []).map(
                (chapter: any) => {
                    return {
                        ...chapter,
                        videos: videosByChapter[chapter.id] || [],
                    };
                }
            );
            return {
                ...course,
                chapters,
            };
        });

        return NextResponse.json(coursesWithDetails);
    } catch (error: any) {
        console.error("Error fetching videos by chapter:", error);
        return NextResponse.json({ error: error.message });
    }
};
