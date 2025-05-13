import { NextResponse } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";
import db from "@/db/drizzle";
import { userTime } from "@/db/schema";
import { auth } from "@clerk/nextjs";

const getTodayRange = () => {
    const now = new Date();
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
    const todayEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
    );
    return { todayStart, todayEnd };
};

const getDayBoundaries = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const end = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
    );
    return { start, end };
};

const getLocalDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const GET = async (req: Request) => {
    try {
        // Get search parameters from URL
        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        // Replace with your actual user authentication logic
        const { userId }: any = auth();

        // If startDate and endDate query parameters are provided, run the range query
        if (startDateParam && endDateParam) {
            const startDate = new Date(startDateParam);
            const endDate = new Date(endDateParam);

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return NextResponse.json(
                    { success: false, error: "Invalid date parameters" },
                    { status: 400 }
                );
            }

            // Adjust boundaries: start at the beginning of the startDate, and end at the end of the endDate
            const { start: startBoundary } = getDayBoundaries(startDate);
            const { end: endBoundary } = getDayBoundaries(endDate);

            // Query DB for the user's records between startBoundary and endBoundary
            const records = await db
                .select()
                .from(userTime)
                .where(
                    and(
                        eq(userTime.userId, userId),
                        gte(userTime.date, startBoundary),
                        lte(userTime.date, endBoundary)
                    )
                );

            // Map the results to a dictionary keyed by date string (YYYY-MM-DD)
            const recordMap = new Map<string, number>();
            records.forEach((rec) => {
                // Extract date portion from timestamp (YYYY-MM-DD)
                const dateKey = getLocalDateKey(new Date(rec.date));
                recordMap.set(dateKey, rec.timeSpent);
            });

            // Build the response array for each day in the range
            const result = [];
            const currentDate = new Date(startBoundary);
            while (currentDate <= endBoundary) {
                const dateKey = getLocalDateKey(currentDate);
                result.push({
                    date: dateKey,
                    timeSpent: Math.floor((recordMap.get(dateKey) || 0) / 1000),
                });
                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return NextResponse.json({ success: true, data: result });
        }

        // Fallback: if no date range is provided, return today's record
        const now = new Date();
        const { start: todayStart, end: todayEnd } = getDayBoundaries(now);
        const records = await db
            .select()
            .from(userTime)
            .where(
                and(
                    eq(userTime.userId, userId),
                    gte(userTime.date, todayStart),
                    lte(userTime.date, todayEnd)
                )
            );
        return NextResponse.json({
            success: true,
            data: records.map((record) => ({
                ...record,
                timeSpent: Math.floor(record.timeSpent / 1000),
            })),
        });
    } catch (error) {
        console.error("Error fetching time records:", error);
        return NextResponse.json(
            { success: false, error: "Error fetching time records" },
            { status: 500 }
        );
    }
};

export const POST = async (req: Request) => {
    try {
        const { timeSpent } = await req.json();

        const { userId }: any = auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { todayStart, todayEnd } = getTodayRange();

        const records = await db
            .select()
            .from(userTime)
            .where(
                and(
                    eq(userTime.userId, userId),
                    gte(userTime.date, todayStart),
                    lte(userTime.date, todayEnd)
                )
            );

        if (records.length > 0) {
            const record = records[0];

            await db
                .update(userTime)
                .set({ timeSpent: record.timeSpent + timeSpent })
                .where(eq(userTime.id, record.id));
        } else {
            await db.insert(userTime).values({
                userId,
                date: new Date(),
                timeSpent,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error tracking time:", error);
        return NextResponse.json(
            { success: false, error: "Error tracking time" },
            { status: 500 }
        );
    }
};
