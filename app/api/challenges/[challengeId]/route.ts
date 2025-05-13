import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const GET = async (
    req: Request,
    { params }: { params: { challengeId: number } }
) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await db.query.challenges.findFirst({
        where: eq(challenges.id, params.challengeId),
    });

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: { challengeId: number } }
) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const type = formData.get("type")?.toString();
    const question = formData.get("question")?.toString();
    const explanation = formData.get("explanation")?.toString();
    const lessonId = formData.get("lessonId")
        ? parseInt(formData.get("lessonId") as string, 10)
        : null;
    const order = formData.get("order")
        ? parseInt(formData.get("order") as string, 10)
        : null;
    const image = formData.get("image") as File | null;

    if (isNaN(params.challengeId)) {
        return new NextResponse("Invalid video ID", { status: 400 });
    }

    const updateData: any = {};
    if (type) updateData.type = type;
    if (question) updateData.question = question;
    if (explanation) updateData.explanation = explanation;
    if (lessonId !== null) updateData.lessonId = lessonId;
    if (order !== null) updateData.order = order;

    if (image) {
        const imageSrc: any = await put(image.name, image, {
            access: "public",
        });
        updateData.questionImagesrc = imageSrc.url;
    }

    const data = await db
        .update(challenges)
        .set(updateData)
        .where(eq(challenges.id, params.challengeId))
        .returning();

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: { challengeId: number } }
) => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await db
        .delete(challenges)
        .where(eq(challenges.id, params.challengeId))
        .returning();

    return NextResponse.json(data[0]);
};
