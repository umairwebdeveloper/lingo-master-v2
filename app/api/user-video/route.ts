import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userVideos } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm"; // For query building

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const videoId = Number(url.searchParams.get("videoId"));

        if (!videoId) {
            return NextResponse.json(
                { success: false, message: "Missing videoId" },
                { status: 400 }
            );
        }

        const result = await db
            .select()
            .from(userVideos)
            .where(eq(userVideos.videoId, videoId));

        if (!result.length) {
            return NextResponse.json(
                { success: false, message: "Video data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result[0],
        });
    } catch (error) {
        console.error("Error fetching video data:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
};

export const POST = async (req: Request) => {
    try {
        const { videoId, isCompleted, views, watchTime } = await req.json();
        const { userId }: any = auth();

        if (!userId || !videoId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: userId or videoId",
                },
                { status: 400 }
            );
        }

        // Check if a record already exists for the user and video
        const existingRecord = await db
            .select()
            .from(userVideos)
            .where(eq(userVideos.videoId, videoId));

        if (existingRecord.length) {
            // Update the existing record
            const result = await db
                .update(userVideos)
                .set({
                    isCompleted: isCompleted ?? existingRecord[0].isCompleted,
                    views: views ?? existingRecord[0].views,
                    watchTime: watchTime ?? existingRecord[0].watchTime,
                    lastWatchedAt: new Date(),
                })
                .where(eq(userVideos.id, existingRecord[0].id));

            return NextResponse.json({
                success: true,
                message: "Video data updated successfully",
                data: result,
            });
        }

        // Insert a new record
        const result = await db.insert(userVideos).values({
            userId,
            videoId,
            isCompleted: isCompleted || false,
            views: views || 0,
            watchTime: watchTime || 0,
            lastWatchedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Video data created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error creating/updating video data:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
};
