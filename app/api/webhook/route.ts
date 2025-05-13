import { NextResponse } from "next/server";
import { createMollieClient } from "@mollie/api-client";
import querystring from "querystring";
import db from "@/db/drizzle";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";

const mollieClient = createMollieClient({
    apiKey: "test_dznA9FJQgzECv3hGQahegxmMAWsMBM",
});

export const POST = async (req: Request) => {
    try {
        const textBody = await req.text();
        const parsedBody = querystring.parse(textBody);

        const { id }: any = parsedBody;

        if (!id) {
            return NextResponse.json(
                { error: "Missing payment ID" },
                { status: 400 }
            );
        }

        const payment: any = await mollieClient.payments.get(id);

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        // Check if a payment for the userId already exists
        const existingPayment = await db
            .select()
            .from(payments)
            .where(eq(payments.userId, payment.metadata.userId))
            .limit(1);

        if (existingPayment.length > 0) {
            // Update the existing payment record
            await db
                .update(payments)
                .set({
                    amount: payment.amount.value,
                    currency: payment.amount.currency,
                    status: payment.status,
                    planType: payment.metadata.planName,
                    createdAt: new Date(payment.createdAt),
                    extraDays: 0,
                })
                .where(eq(payments.userId, payment.metadata.userId));

            console.log("Payment updated successfully:", payment);
        } else {
            // Insert a new payment record
            await db.insert(payments).values({
                userId: payment.metadata.userId,
                amount: payment.amount.value,
                currency: payment.amount.currency,
                status: payment.status,
                planType: payment.metadata.planName,
                createdAt: new Date(payment.createdAt),
            });

            console.log("Payment inserted successfully:", payment);
        }

        // Handle payment status
        if (payment.status === "paid") {
            console.log("Payment successful:", payment);
            // Add logic for successful payment (e.g., update order status in DB)
        } else if (payment.status === "failed") {
            console.log("Payment failed:", payment);
            // Add logic for failed payment
        }

        // Always respond with 200 to acknowledge receipt
        return NextResponse.json(
            { message: "Webhook received successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
