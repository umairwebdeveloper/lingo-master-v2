// app/api/user-answers/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userAnswers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

// 1. POST /api/user-answers

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { questionId, selectedAnswer, isCorrect } = await req.json();
        const isCorrectString = isCorrect === true ? "true" : "false";

        // 1. Check if an answer already exists for this user & question
        const existingAnswer = await db
            .select()
            .from(userAnswers)
            .where(
                and(
                    eq(userAnswers.userId, userId),
                    eq(userAnswers.questionId, questionId)
                )
            );

        if (existingAnswer.length > 0) {
            // 2. If it exists, update the existing record
            await db
                .update(userAnswers)
                .set({
                    selectedAnswer,
                    isCorrect: isCorrectString,
                })
                .where(
                    and(
                        eq(userAnswers.userId, userId),
                        eq(userAnswers.questionId, questionId)
                    )
                );

            return NextResponse.json({ success: true, action: "updated" });
        } else {
            // 3. If not, insert a new record
            await db.insert(userAnswers).values({
                userId,
                questionId,
                selectedAnswer,
                isCorrect: isCorrectString,
            });

            return NextResponse.json({ success: true, action: "inserted" });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 2. GET /api/user-answers?questionId=...&userId=...
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const questionId = searchParams.get("questionId");
        const { userId } = auth();

        if (!questionId || !userId) {
            return NextResponse.json(
                { error: "questionId and userId are required" },
                { status: 400 }
            );
        }

        const rows = await db
            .select()
            .from(userAnswers)
            .where(
                and(
                    eq(userAnswers.questionId, Number(questionId)),
                    eq(userAnswers.userId, userId)
                )
            );

        if (rows.length === 0) {
            return NextResponse.json({ answer: null });
        }

        // For simplicity, return the first matching record
        return NextResponse.json({ answer: rows[0] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
