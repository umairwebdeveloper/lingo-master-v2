import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { userStreak } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export async function GET() {
    try {
        // Get user authentication info
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const now = new Date();
        const todayStr = now.toDateString();
        const defaultWeekdays = Array(7).fill(false);
        defaultWeekdays[now.getDay()] = true;

        // Fetch the existing streak record
        const records = await db
            .select()
            .from(userStreak)
            .where(eq(userStreak.userId, userId))
            .limit(1);

        let streak;

        if (records.length === 0) {
            // Create a new streak record if none exists
            const [newRecord] = await db
                .insert(userStreak)
                .values({
                    userId,
                    streakCount: 1,
                    lastLoginDate: now,
                    weekdaysActive: defaultWeekdays,
                    lastWeekDate: now,
                })
                .returning();
            streak = newRecord;
        } else {
            streak = records[0];

            // Parse lastLoginDate to a Date object if it exists
            const lastLogin = streak.lastLoginDate
                ? new Date(streak.lastLoginDate)
                : null;
            const lastLoginStr = lastLogin ? lastLogin.toDateString() : "";

            // Update streak only if the user logs in on a new day
            if (lastLoginStr !== todayStr) {
                // Check if the last login was yesterday to determine if the streak continues
                const yesterday = new Date(now);
                yesterday.setDate(now.getDate() - 1);
                const wasYesterday =
                    lastLogin &&
                    lastLogin.toDateString() === yesterday.toDateString();
                const newStreakCount = wasYesterday
                    ? streak.streakCount + 1
                    : 1;

                // Ensure weekdaysActive is valid and update today's activity
                const weekdays =
                    Array.isArray(streak.weekdaysActive) &&
                    streak.weekdaysActive.length === 7
                        ? [...streak.weekdaysActive]
                        : Array(7).fill(false);
                weekdays[now.getDay()] = true;

                // Reset the streak if a week has passed since the last weekly update
                const lastWeekDateThreshold = new Date(
                    now.getTime() - 7 * 24 * 60 * 60 * 1000
                );
                const previousLastWeekDate = streak.lastWeekDate
                    ? new Date(streak.lastWeekDate)
                    : now;

                if (lastWeekDateThreshold >= previousLastWeekDate) {
                    // Reset streak and weekdaysActive for the new week
                    await db
                        .update(userStreak)
                        .set({
                            streakCount: 1,
                            lastLoginDate: now,
                            weekdaysActive: defaultWeekdays,
                            lastWeekDate: now,
                        })
                        .where(eq(userStreak.userId, userId));

                    streak = {
                        ...streak,
                        streakCount: 1,
                        lastLoginDate: now,
                        weekdaysActive: defaultWeekdays,
                        lastWeekDate: now,
                    };
                } else {
                    // Update streak normally
                    await db
                        .update(userStreak)
                        .set({
                            streakCount: newStreakCount,
                            lastLoginDate: now,
                            weekdaysActive: weekdays,
                        })
                        .where(eq(userStreak.userId, userId));

                    streak = {
                        ...streak,
                        streakCount: newStreakCount,
                        lastLoginDate: now,
                        weekdaysActive: weekdays,
                    };
                }
            }
        }

        return NextResponse.json(streak);
    } catch (error) {
        console.error("Error updating user streak:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
