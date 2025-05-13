import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import db from "@/db/drizzle";
import { eq, sql } from "drizzle-orm";
import { lessons, challenges, challengeProgress } from "@/db/schema";

export const GET = async (req: Request) => {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        try {
            const userProgressData = await db
                .select({
                    lessonId: lessons.id,
                    lessonTitle: lessons.title,
                    totalChallenges: sql<number>`COUNT(${challenges.id})`.as(
                        "totalChallenges"
                    ),
                    completedChallenges:
                        sql<number>`SUM(CASE WHEN ${challengeProgress.completed} THEN 1 ELSE 0 END)`.as(
                            "completedChallenges"
                        ),
                    correctAnswers:
                        sql<number>`SUM(CASE WHEN ${challengeProgress.completed} = true THEN 1 ELSE 0 END)`.as(
                            "correctAnswers"
                        ),
                    incorrectAnswers:
                        sql<number>`SUM(CASE WHEN ${challengeProgress.completed} = false THEN 1 ELSE 0 END)`.as(
                            "incorrectAnswers"
                        ),
                })
                .from(lessons)
                .leftJoin(
                    challenges,
                    sql`${challenges.lessonId} = ${lessons.id}`
                )
                .leftJoin(
                    challengeProgress,
                    sql`${challengeProgress.challengeId} = ${challenges.id}`
                )
                .where(sql`${challengeProgress.userId} = ${userId}`)
                .groupBy(lessons.id, lessons.title);

            return NextResponse.json({ success: true, data: userProgressData });
        } catch (error) {
            return NextResponse.json(
                { error: "Internal server error, 500" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
