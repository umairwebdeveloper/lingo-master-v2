import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { payments } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export const POST = async (req: Request) => {
    try {
        const { extraDays } = await req.json();
        const { userId } = auth();

        if (!userId || typeof extraDays !== "number") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const now = new Date();
        const oneWeekMs = 5 * 24 * 60 * 60 * 1000;

        // Retrieve the most recent payment for this user using descending order.
        const [lastPayment] = await db
            .select()
            .from(payments)
            .where(eq(payments.userId, userId))
            .orderBy(desc(payments.createdAt))
            .limit(1);

        // If a payment exists, check the extraDaysDate.
        if (lastPayment) {
            if (lastPayment.extraDaysDate) {
                const lastExtraDate = new Date(lastPayment.extraDaysDate);
                if (now.getTime() - lastExtraDate.getTime() < oneWeekMs) {
                    return NextResponse.json(
                        { error: "Extra day already added for this week" },
                        { status: 200 }
                    );
                }
            }
        }

        // Update the payments record: add the extra day and update extraDaysDate to now.
        const updatedPayment = await db
            .update(payments)
            .set({
                extraDays: sql`${payments.extraDays} + ${extraDays}`,
                extraDaysDate: now,
            })
            .where(eq(payments.userId, userId))
            .returning();

        return NextResponse.json(
            {
                success: true,
                message: "Extra day added successfully",
                data: updatedPayment,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating extra day:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
