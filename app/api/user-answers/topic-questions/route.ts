import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { questions, userAnswers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
    try {
        // 1. Get query parameters: userId, topicId
        const { searchParams } = new URL(req.url);
        const { userId } = auth();
        const topicId = searchParams.get("topicId");

        if (!userId || !topicId) {
            return NextResponse.json(
                { error: "Missing userId or topicId in query params" },
                { status: 400 }
            );
        }

        // 2. Query all questions for the given topicId, left-join userAnswers for this user
        const questionRecords = await db
            .select({
                questionId: questions.id,
                userAnswerIsCorrect: userAnswers.isCorrect, // 'true', 'false', or null
            })
            .from(questions)
            .leftJoin(
                userAnswers,
                and(
                    eq(questions.id, userAnswers.questionId),
                    eq(userAnswers.userId, userId)
                )
            )
            .where(eq(questions.topicId, parseInt(topicId, 10)))
            .orderBy(questions.id); // optional: sort by question ID

        // 3. Transform each question into { id, number, status }
        //    status is determined by userAnswers.isCorrect
        //    - null => 'pending'
        //    - 'true' => 'correct'
        //    - 'false' => 'incorrect'
        const data = questionRecords.map((record) => {
            let status: "pending" | "correct" | "incorrect" = "pending";

            if (record.userAnswerIsCorrect === "true") {
                status = "correct";
            } else if (record.userAnswerIsCorrect === "false") {
                status = "incorrect";
            }

            return {
                id: record.questionId,
                status,
            };
        });

        // 4. Return the array
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/topic-questions error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
