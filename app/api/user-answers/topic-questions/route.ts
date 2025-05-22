import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { questions, userAnswers, topics } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const { userId } = auth();
        const topicIdParam = searchParams.get("topicId");

        if (!userId || !topicIdParam) {
            return NextResponse.json(
                { error: "Missing userId or topicId in query params" },
                { status: 400 }
            );
        }

        const topicId = parseInt(topicIdParam, 10);

        // Fetch topic info
        const topicRecord = await db
            .select({
                id: topics.id,
                name: topics.topic,
                image: topics.topicImage,
                category: topics.category,
                status: topics.status,
                order: topics.order,
            })
            .from(topics)
            .where(eq(topics.id, topicId))
            .limit(1)
            .then((rows) => rows[0] || null);

        if (!topicRecord) {
            return NextResponse.json(
                { error: "Topic not found" },
                { status: 404 }
            );
        }

        // Select question fields plus the user’s answer and correctness
        const questionRecords = await db
            .select({
                id: questions.id,
                type: questions.question_type,
                category: questions.category,
                questionText: questions.question,
                description: questions.description,
                options: questions.options,
                imageOptions: questions.imageOptions,
                image: questions.image,
                correctAnswer: questions.correctAnswer,
                explanation: questions.explanation,
                selectedAnswer: userAnswers.selectedAnswer,
                userAnswerIsCorrect: userAnswers.isCorrect,
            })
            .from(questions)
            .leftJoin(
                userAnswers,
                and(
                    eq(questions.id, userAnswers.questionId),
                    eq(userAnswers.userId, userId)
                )
            )
            .where(eq(questions.topicId, topicId))
            .orderBy(questions.id);

        // Map into a rich payload
        const questionsData = questionRecords.map((q) => {
            let status: "pending" | "correct" | "incorrect" = "pending";
            if (q.userAnswerIsCorrect === "true") {
                status = "correct";
            } else if (q.userAnswerIsCorrect === "false") {
                status = "incorrect";
            }

            return {
                id: q.id,
                type: q.type,
                category: q.category,
                questionText: q.questionText,
                description: q.description,
                options: q.options,
                imageOptions: q.imageOptions,
                image: q.image,
                explanation: q.explanation,
                correctAnswer: q.correctAnswer,
                selectedAnswer: q.selectedAnswer,
                status,
                is_correct: q.userAnswerIsCorrect,
            };
        });

        // Return both topic info and questions
        return NextResponse.json({
            topic: topicRecord,
            questions: questionsData,
        });
    } catch (error) {
        console.error("GET /api/topic-questions error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// const ans = await db.delete(userAnswers).where(eq(userAnswers.userId, userId));
