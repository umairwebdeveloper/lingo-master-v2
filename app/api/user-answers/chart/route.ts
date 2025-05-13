import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userAnswers, questions } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export const GET = async (req: Request) => {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const { userId } = auth();

    if (!userId || !startDate || !endDate) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Convert startDate and endDate to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Adjust end date to include the full day
        end.setHours(23, 59, 59, 999);

        const results = await db
            .select({
                date: sql`DATE(${userAnswers.createdAt})`,
                total: sql<number>`COUNT(*)`,
                correct: sql<number>`SUM(CASE WHEN ${userAnswers.isCorrect} = 'true' THEN 1 ELSE 0 END)`,
                incorrect: sql<number>`SUM(CASE WHEN ${userAnswers.isCorrect} = 'false' THEN 1 ELSE 0 END)`,
            })
            .from(userAnswers)
            .where(
                and(
                    eq(userAnswers.userId, userId),
                    gte(userAnswers.createdAt, start),
                    lte(userAnswers.createdAt, end)
                )
            )
            .groupBy(sql`DATE(${userAnswers.createdAt})`)
            .orderBy(sql`DATE(${userAnswers.createdAt})`);

        // Build a map from the query result for easy lookup by date.
        const resultMap: Record<
            string,
            { total: number; correct: number; incorrect: number }
        > = {};
        results.forEach((result: any) => {
            resultMap[result.date] = {
                total: result.total,
                correct: result.correct,
                incorrect: result.incorrect,
            };
        });

        // Generate an array of all dates between start and end (inclusive).
        const dateArray: string[] = [];
        for (
            let current = new Date(start);
            current <= end;
            current.setDate(current.getDate() + 1)
        ) {
            const dateStr = current.toISOString().split("T")[0];
            dateArray.push(dateStr);
        }

        // Combine the query result with the full date range,
        // ensuring dates without any answers are set to 0.
        const finalResults = dateArray.map((date) => ({
            date,
            total: resultMap[date]?.total || 0,
            correct: resultMap[date]?.correct || 0,
            incorrect: resultMap[date]?.incorrect || 0,
        }));

        return NextResponse.json({ data: finalResults });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
