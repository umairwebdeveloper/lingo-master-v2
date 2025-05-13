import db from "@/db/drizzle";
import { videos } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";

export const GET = async () => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await db.query.videos.findMany();

    return NextResponse.json(data);
};

export const POST = async (req: Request) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();
        const chapterId = parseInt(formData.get("chapterId") as string, 10);
        const order = parseInt(formData.get("order") as string, 10);
        const duration = parseInt(formData.get("duration") as string, 10);
        const video = formData.get("video") as File;

        if (
            !title ||
            !description ||
            isNaN(chapterId) ||
            isNaN(order) ||
            !video
        ) {
            return new NextResponse("Invalid input", { status: 400 });
        }

        const videoSrc: any = await put(video.name, video, {
            access: "public",
        });

        await db.insert(videos).values({
            title,
            description,
            chapterId,
            order,
            videoSrc: videoSrc.url,
            duration,
        });

        return NextResponse.json({
            success: true,
            message: "Video created successfully",
            videoSrc: videoSrc,
        });
    } catch (error) {
        console.error("Error creating video:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const PUT = async (req: Request) => {
    // Check if the user is an admin
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Parse the form data
        const formData = await req.formData();
        const videoId = parseInt(formData.get("videoId") as string, 10);
        const title = formData.get("title")?.toString();
        const description = formData.get("description")?.toString();
        const chapterId = formData.get("chapterId")
            ? parseInt(formData.get("chapterId") as string, 10)
            : null;
        const order = formData.get("order")
            ? parseInt(formData.get("order") as string, 10)
            : null;
        const duration = parseInt(formData.get("duration") as string, 10);
        const video = formData.get("video") as File | null;

        // Validate input
        if (isNaN(videoId)) {
            return new NextResponse("Invalid video ID", { status: 400 });
        }

        // Prepare the update data
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (chapterId !== null) updateData.unitId = chapterId;
        if (order !== null) updateData.order = order;
        if (duration !== null) updateData.duration = duration;

        // Handle video replacement if a new video is provided
        if (video) {
            const videoSrc = await put(video.name, video, { access: "public" });
            updateData.videoSrc = videoSrc.url;
        }

        // Update the video record in the database
        const result = await db
            .update(videos)
            .set(updateData)
            .where(eq(videos.id, videoId));

        // Return a success response
        return NextResponse.json({
            success: true,
            message: "Video updated successfully",
        });
    } catch (error) {
        console.error("Error updating video:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
