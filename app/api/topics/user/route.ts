import db from "@/db/drizzle";
import { topics, questions, userAnswers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Function to aggregate submission counts by question category for each topic.
async function getTopicSubmissionCountsByCategory() {
    const results = await db
        .select({
            topicId: topics.id,
            topic: topics.topic,
            category: questions.category,
            submissionCount: sql<number>`COUNT(${userAnswers.id})`,
            correctCount: sql<number>`SUM(CASE WHEN ${userAnswers.isCorrect} = 'true' THEN 1 ELSE 0 END)`,
            incorrectCount: sql<number>`SUM(CASE WHEN ${userAnswers.isCorrect} = 'false' THEN 1 ELSE 0 END)`,
        })
        .from(topics)
        .leftJoin(questions, eq(questions.topicId, topics.id))
        .leftJoin(userAnswers, eq(userAnswers.questionId, questions.id))
        .groupBy(topics.id, topics.topic, questions.category)
        .execute();

    return results;
}

export const GET = async () => {
    try {
        // Authenticate user
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch all topics
        const topicList = await db.select().from(topics);

        // Get question counts for each topic
        const questionCounts = await db
            .select({
                topicId: questions.topicId,
                questionCount: sql`COUNT(${questions.id})`.as("questionCount"),
            })
            .from(questions)
            .groupBy(questions.topicId);

        // Get user answer stats (for the authenticated user) per topic
        const userAnswerStats = await db
            .select({
                topicId: questions.topicId,
                correctCount:
                    sql`SUM(CASE WHEN ${userAnswers.isCorrect} = 'true' THEN 1 ELSE 0 END)`.as(
                        "correctCount"
                    ),
                incorrectCount:
                    sql`SUM(CASE WHEN ${userAnswers.isCorrect} = 'false' THEN 1 ELSE 0 END)`.as(
                        "incorrectCount"
                    ),
                completedCount: sql`COUNT(${userAnswers.id})`.as(
                    "completedCount"
                ),
            })
            .from(userAnswers)
            .innerJoin(questions, eq(userAnswers.questionId, questions.id))
            .where(eq(userAnswers.userId, userId))
            .groupBy(questions.topicId);

        // Get aggregated category stats for each topic
        const rawCategoryStats = await getTopicSubmissionCountsByCategory();

        // Process category stats to add the correct ratio as a percentage.
        // The correct ratio percentage = (correctCount / submissionCount) * 100, rounded to 2 decimals.
        const categoryStats = rawCategoryStats.map((cat) => ({
            ...cat,
            correctRatio:
                cat.submissionCount > 0
                    ? Number(
                          (
                              (cat.correctCount / cat.submissionCount) *
                              100
                          ).toFixed(2)
                      )
                    : 0,
        }));

        // Merge all statistics into the topic data
        const topicsWithStats = topicList.map((topic) => {
            const questionStat = questionCounts.find(
                (qc) => qc.topicId === topic.id
            ) || { questionCount: 0 };

            const userStat = userAnswerStats.find(
                (stat) => stat.topicId === topic.id
            ) || {
                correctCount: 0,
                incorrectCount: 0,
                completedCount: 0,
            };

            // Get category stats for this topic by filtering the aggregated category data
            const topicCategoryStats = categoryStats.filter(
                (cat) => cat.topicId === topic.id
            );

            return {
                ...topic,
                questionCount: questionStat.questionCount,
                correctCount: userStat.correctCount,
                incorrectCount: userStat.incorrectCount,
                completedCount: userStat.completedCount,
                categoryStats: topicCategoryStats,
            };
        });

        return NextResponse.json(topicsWithStats);
    } catch (error) {
        console.error("Error fetching topics with stats:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
