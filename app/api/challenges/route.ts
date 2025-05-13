import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const GET = async () => {
    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const data = await db.query.challenges.findMany();

    return NextResponse.json(data);
};

export const POST = async (req: Request) => {
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

    await db.insert(challenges).values(updateData);

    return NextResponse.json({
        success: true,
        message: "Challenge created successfully",
    });
};
