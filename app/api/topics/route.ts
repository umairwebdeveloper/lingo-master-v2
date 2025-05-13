import db from "@/db/drizzle";
import { topics } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const GET = async () => {
    try {
        // Fetch all topics
        const data = await db.query.topics.findMany();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching topics:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { topic, topicImage } = body;

        // Validate request body
        if (!topic || !topicImage) {
            return new NextResponse("Bad Request: Missing required fields", {
                status: 400,
            });
        }

        // Insert the new topic
        const data = await db
            .insert(topics)
            .values({ topic, topicImage, category: topicImage })
            .returning();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error inserting topic:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const PUT = async (req: Request) => {
    try {
        const body = await req.json();
        const { id, topic, topicImage } = body;

        // Validate request body
        if (!id || (!topic && !topicImage)) {
            return new NextResponse("Bad Request: Missing required fields", {
                status: 400,
            });
        }

        // Update the topic
        const data = await db
            .update(topics)
            .set({ topic: topic, topicImage: topicImage, category: topicImage })
            .where(eq(topics.id, id))
            .returning();

        if (!data.length) {
            return new NextResponse("Not Found: Topic not found", {
                status: 404,
            });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error updating topic:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const DELETE = async (req: Request) => {
    try {
        const body = await req.json();
        const { id } = body;

        // Validate request body
        if (!id) {
            return new NextResponse("Bad Request: Missing topic ID", {
                status: 400,
            });
        }

        // Delete the topic
        const data = await db
            .delete(topics)
            .where(eq(topics.id, id))
            .returning();

        if (!data.length) {
            return new NextResponse("Not Found: Topic not found", {
                status: 404,
            });
        }

        return NextResponse.json(
            { success: true, message: "Topic deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting topic:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
