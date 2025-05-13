import db from "@/db/drizzle";
import { courses, videoChapters, videos } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: { courseId: string } }
) => {
    try {
        // Validate `courseId`
        const courseId = params?.courseId;
        if (!courseId) {
            return new NextResponse("Course ID is required.", { status: 400 });
        }

        const isCourseIdNumeric = !isNaN(Number(courseId));
        const courseFilter = isCourseIdNumeric
            ? eq(courses.id, Number(courseId))
            : eq(courses.title, courseId);

        // Fetch course
        const courseResult = await db
            .select()
            .from(courses)
            .where(courseFilter)
            .limit(1);
        if (courseResult.length === 0) {
            return new NextResponse("Course not found.", { status: 404 });
        }
        const course = courseResult[0];

        // Fetch chapters and videos
        const chaptersWithVideos = await db
            .select({
                id: videoChapters.id,
                title: videoChapters.title,
                order: videoChapters.order,
                videoId: videos.id,
                videoTitle: videos.title,
                videoDescription: videos.description,
                videoOrder: videos.order,
                videoSrc: videos.videoSrc,
            })
            .from(videoChapters)
            .leftJoin(videos, eq(videoChapters.id, videos.chapterId))
            .where(eq(videoChapters.courseId, course.id))
            .orderBy(videoChapters.order, videos.order);

        // Group videos by chapters
        const chapters = chaptersWithVideos.reduce((acc: any, chapter) => {
            const existing = acc.find((c: any) => c.id === chapter.id);
            const video = {
                id: chapter.videoId,
                title: chapter.videoTitle,
                description: chapter.videoDescription,
                order: chapter.videoOrder,
                videoSrc: chapter.videoSrc,
            };

            if (existing) {
                if (video.id) existing.videos.push(video);
            } else {
                acc.push({
                    id: chapter.id,
                    title: chapter.title,
                    order: chapter.order,
                    videos: video.id ? [video] : [],
                });
            }

            return acc;
        }, []);

        return NextResponse.json({
            success: true,
            data: {
                course,
                chapters,
            },
        });
    } catch (error) {
        console.error("Error fetching course data:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
