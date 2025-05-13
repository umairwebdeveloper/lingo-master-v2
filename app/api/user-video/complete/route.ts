// pages/api/video-complete.ts

import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userVideos } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function POST(request: Request) {
    try {
        const { videoId } = await request.json();
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!videoId) {
            return NextResponse.json(
                { error: "videoId is required" },
                { status: 400 }
            );
        }

        const existing = await db
            .select()
            .from(userVideos)
            .where(
                and(
                    eq(userVideos.videoId, videoId),
                    eq(userVideos.userId, userId)
                )
            );

        if (existing.length > 0) {
            return NextResponse.json({ already_completed: true });
        } else {
            await db.insert(userVideos).values({
                userId: userId,
                videoId,
                isCompleted: true,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error marking video as complete:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
