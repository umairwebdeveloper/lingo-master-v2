import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { units, videos } from "@/db/schema"; // Import your Drizzle schemas
import { eq } from "drizzle-orm";
export const GET = async () => {
    try {
        // Fetch all units
        const allUnits = await db.select().from(units).orderBy(units.order);

        // Fetch videos grouped by unit
        const videoMap = await db
            .select()
            .from(videos)
            .orderBy(videos.order)
            .then((allVideos) =>
                allVideos.reduce((acc, video: any) => {
                    if (!acc[video.unitId]) {
                        acc[video.unitId] = [];
                    }
                    acc[video.unitId].push(video);
                    return acc;
                }, {} as Record<number, (typeof videos)[]>)
            );

        // Combine units and their videos
        const combinedData = allUnits.map((unit) => ({
            ...unit,
            videos: videoMap[unit.id] || [],
        }));

        // Return the combined data
        return NextResponse.json(combinedData);
    } catch (error) {
        console.error("Error fetching units with videos:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
