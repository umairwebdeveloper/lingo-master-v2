import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { eq, sql } from "drizzle-orm";
import { challenges, challengeProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs";

export const GET = async (req: Request) => {
    try {
        const { userId } = auth(); // Replace with your auth logic to get `userId`

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized. User not signed in." },
                { status: 401 }
            );
        }

        // Fetch total challenges
        const totalChallengesResult = await db.execute(
            sql`SELECT COUNT(*) AS count FROM challenges`
        );
        const totalChallenges: any = totalChallengesResult.rows[0]?.count || 0;

        // Fetch completed challenges for the specific user
        const completedChallengesResult = await db.execute(
            sql`SELECT COUNT(*) AS count 
                FROM challenges_progress 
                WHERE user_id = ${userId} AND completed = true`
        );
        const completedChallenges: any =
            completedChallengesResult.rows[0]?.count || 0;

        // Calculate progress percentage
        const progressPercentage =
            totalChallenges > 0
                ? Math.round((completedChallenges / totalChallenges) * 100)
                : 0;

        return NextResponse.json(
            {
                totalChallenges,
                completedChallenges,
                progressPercentage,
                message: `You have completed ${completedChallenges} out of ${totalChallenges} challenges (${progressPercentage}%).`,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching challenge progress:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
