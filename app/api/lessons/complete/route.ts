import db from "@/db/drizzle";
import { challenges, challengeOptions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm"; // Import eq and and operators

export const GET = async (req: Request) => {
    const url = new URL(req.url);
    const lessonId = url.searchParams.get("lessonId");

    if (!lessonId || isNaN(Number(lessonId))) {
        return NextResponse.json(
            { error: "invalid lesson id" },
            { status: 401 }
        );
    }

    const results = await db
        .select({
            question: challenges.question,
            explanation: challenges.explanation,
            questionImagesrc: challenges.questionImagesrc,
            correctAnswer: challengeOptions.text,
        })
        .from(challenges)
        .leftJoin(
            challengeOptions,
            eq(challengeOptions.challengeId, challenges.id)
        )
        .where(
            and(
                eq(challenges.lessonId, Number(lessonId)),
                eq(challengeOptions.correct, true)
            )
        );

    return NextResponse.json(results);
};
