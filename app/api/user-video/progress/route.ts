import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { videos, userVideos } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

const calculateProgressPercentage = async (userId: any) => {
    // Get the total number of videos
    const totalVideos: any = await db
        .select({ count: sql`COUNT(*)` })
        .from(videos);

    if (totalVideos[0]?.count === 0)
        return { progress: 0, totalVideos: 0, completedVideos: 0 };

    // Get the number of completed videos for the user
    const completedVideos: any = await db
        .select({ count: sql`COUNT(*)` })
        .from(userVideos)
        .where(
            sql`${userVideos.userId} = ${userId} AND ${userVideos.isCompleted} = true`
        );

    // Calculate progress percentage
    const progress = (completedVideos[0]?.count / totalVideos[0]?.count) * 100;

    return {
        progress:
            isNaN(progress) || progress < 0
                ? 0
                : progress > 100
                ? 100
                : progress,
        totalVideos: totalVideos[0]?.count,
        completedVideos:
            completedVideos[0]?.count > totalVideos[0]?.count
                ? totalVideos[0]?.count
                : completedVideos[0]?.count,
    };
};

const getLastWatchedVideo = async (userId: any) => {
    // First, check if any user video records exist for the given user
    const userVideoRecords = await db
        .select()
        .from(userVideos)
        .where(eq(userVideos.userId, userId));

    if (userVideoRecords.length === 0) {
        // If no records exist, return the first video from the videos table
        const firstVideo = await db
            .select({
                videoId: videos.id,
                title: videos.title,
                videoSrc: videos.videoSrc,
                description: videos.description,
            })
            .from(videos)
            .orderBy(sql`${videos.id} ASC`)
            .limit(1);
        return firstVideo[0] || null;
    }

    // Otherwise, fetch the last watched video by ordering the records by lastWatchedAt
    const lastWatched = await db
        .select({
            videoId: userVideos.videoId,
            title: videos.title,
            lastWatchedAt: userVideos.lastWatchedAt,
            videoSrc: videos.videoSrc,
            description: videos.description,
        })
        .from(userVideos)
        .leftJoin(videos, eq(videos.id, userVideos.videoId))
        .where(eq(userVideos.userId, userId))
        .orderBy(sql`${userVideos.lastWatchedAt} DESC`)
        .limit(1);

    return lastWatched[0];
};

export const GET = async () => {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { progress, totalVideos, completedVideos } =
            await calculateProgressPercentage(userId);
        const lastWatchedVideo = await getLastWatchedVideo(userId);

        return NextResponse.json(
            {
                progress,
                totalVideos,
                completedVideos,
                lastWatchedVideo,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching streak:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
