import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userStreak } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export const POST = async (req: Request) => {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const today = new Date();
        const weekday = today.toLocaleString("en-US", { weekday: "long" }); // e.g., "Monday"
        const [existingStreak] = await db
            .select()
            .from(userStreak)
            .where(eq(userStreak.userId, userId));

        if (!existingStreak) {
            // Create a new streak record with today's weekday
            await db.insert(userStreak).values({
                userId,
                streakCount: 1,
                lastLoginDate: today,
                weekdaysActive: [weekday],
            });
            return NextResponse.json(
                { streakCount: 1, weekdaysActive: [weekday] },
                { status: 200 }
            );
        }

        const lastLoginDate = new Date(existingStreak.lastLoginDate || 0);
        const diffInDays = Math.floor(
            (today.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        let newStreakCount: any = existingStreak.streakCount;
        let weekdaysActive: any = existingStreak.weekdaysActive || [];

        if (diffInDays === 1) {
            // Increment streak if logged in consecutively
            newStreakCount += 1;
        } else if (diffInDays > 1) {
            // Reset streak
            newStreakCount = 1;
            weekdaysActive = [];
        }

        // Add today's weekday if not already present
        if (!weekdaysActive.includes(weekday)) {
            weekdaysActive.push(weekday);
        }

        await db
            .update(userStreak)
            .set({
                streakCount: newStreakCount,
                lastLoginDate: today,
                weekdaysActive,
            })
            .where(eq(userStreak.userId, userId));

        return NextResponse.json(
            { streakCount: newStreakCount, weekdaysActive },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating streak:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const GET = async () => {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const [existingStreak] = await db
            .select()
            .from(userStreak)
            .where(eq(userStreak.userId, userId));

        if (!existingStreak) {
            return NextResponse.json(
                { streakCount: 0, weekdaysActive: [] },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                streakCount: existingStreak.streakCount,
                weekdaysActive: existingStreak.weekdaysActive,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching streak:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
};
