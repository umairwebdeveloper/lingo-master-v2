import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { questions, userAnswers } from "@/db/schema";
import { sql, eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export const GET = async (request: Request) => {
    // Retrieve the userId from Clerk auth
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Missing userId query parameter" },
            { status: 400 }
        );
    }

    // Get the total count of questions
    const [{ count: totalQuestionsCount }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(questions);

    // Get the total count of answers for the specified user
    const [{ count: totalUserAnswersCount }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userAnswers)
        .where(eq(userAnswers.userId, userId));

    // Count the number of correct answers for the user (assuming "true" as a string)
    const [{ count: correctCount }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userAnswers)
        .where(
            and(
                eq(userAnswers.userId, userId),
                eq(userAnswers.isCorrect, "true")
            )
        );

    // Count the number of incorrect answers for the user (assuming "false" as a string)
    const [{ count: incorrectCount }] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(userAnswers)
        .where(
            and(
                eq(userAnswers.userId, userId),
                eq(userAnswers.isCorrect, "false")
            )
        );

    // Calculate percentages
    const correctPercentage =
        totalUserAnswersCount > 0
            ? (correctCount / totalUserAnswersCount) * 100
            : 0;
    const progressPercentage =
        totalQuestionsCount > 0
            ? (totalUserAnswersCount / totalQuestionsCount) * 100
            : 0;

    // Build the aggregated response object
    const data = {
        title: "Practice Exams",
        description: "Practice with real CBR questions.",
        totalQuestions: totalQuestionsCount,
        totalUserAnswers: totalUserAnswersCount,
        correctCount,
        incorrectCount,
        correctPercentage,
        progressPercentage,
    };

    return NextResponse.json(data);
};
