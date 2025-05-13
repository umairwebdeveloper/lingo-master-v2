import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import db from "@/db/drizzle";
import { userAnswers, questions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST: Add a new answer

export const POST = async (req: Request) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { questionId, selectedAnswer, isCorrect } = await req.json();

        if (!questionId || !selectedAnswer) {
            return NextResponse.json(
                { error: "Question ID and Selected Answer are required" },
                { status: 400 }
            );
        }

        // Check if an answer already exists for the user and question
        const existingAnswer = await db
            .select()
            .from(userAnswers)
            .where(
                and(
                    eq(userAnswers.userId, userId),
                    eq(userAnswers.questionId, questionId)
                )
            )
            .limit(1);

        let result;

        if (existingAnswer.length > 0) {
            // Update the existing answer
            result = await db
                .update(userAnswers)
                .set({
                    selectedAnswer,
                    isCorrect: isCorrect ? "true" : "false",
                })
                .where(
                    and(
                        eq(userAnswers.userId, userId),
                        eq(userAnswers.questionId, questionId)
                    )
                )
                .returning();
        } else {
            // Insert a new answer
            result = await db
                .insert(userAnswers)
                .values({
                    userId,
                    questionId,
                    selectedAnswer,
                    isCorrect: isCorrect ? "true" : "false",
                })
                .returning();
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};


export const GET = async (req: Request) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const questionId = url.searchParams.get("questionId");
        const topicId = url.searchParams.get("topicId");

        let answer;

        if (topicId) {
            // Fetch user answers by topicId
            answer = await db
                .select({
                    questionId: userAnswers.questionId,
                    selectedAnswer: userAnswers.selectedAnswer,
                    isCorrect: userAnswers.isCorrect,
                    question: questions.question,
                    options: questions.options,
                    correctAnswer: questions.correctAnswer,
                    explanation: questions.explanation,
                })
                .from(userAnswers)
                .innerJoin(questions, eq(questions.id, userAnswers.questionId))
                .where(
                    and(
                        eq(userAnswers.userId, userId),
                        eq(questions.topicId, Number(topicId))
                    )
                );
        } else if (questionId) {
            // Fetch a single answer for the given questionId
            const result = await db
                .select()
                .from(userAnswers)
                .where(
                    and(
                        eq(userAnswers.userId, userId),
                        eq(userAnswers.questionId, Number(questionId))
                    )
                )
                .limit(1); // Ensure only one record is fetched

            answer = result[0] || null; // Return the first result or null if no record exists
        } else {
            // Fetch all answers for the user
            answer = await db
                .select()
                .from(userAnswers)
                .where(eq(userAnswers.userId, userId));
        }

        return NextResponse.json({ success: true, data: answer });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};


// PUT: Update a user's answer
export const PUT = async (req: Request) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id, selectedAnswer, isCorrect } = await req.json();

        if (!id || !selectedAnswer) {
            return NextResponse.json(
                { error: "Answer ID and Selected Answer are required" },
                { status: 400 }
            );
        }

        const result = await db
            .update(userAnswers)
            .set({
                selectedAnswer,
                isCorrect: isCorrect ? "true" : "false",
            })
            .where(eq(userAnswers.id, id))
            .returning();

        if (!result.length) {
            return NextResponse.json(
                { error: "Not Found: Answer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

// DELETE: Delete a user's answer
export const DELETE = async (req: Request) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Answer ID is required" },
                { status: 400 }
            );
        }

        const result = await db
            .delete(userAnswers)
            .where(eq(userAnswers.id, id))
            .returning();

        if (!result.length) {
            return NextResponse.json(
                { error: "Not Found: Answer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Answer deleted" });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
