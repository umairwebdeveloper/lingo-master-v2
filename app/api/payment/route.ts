import { NextResponse } from "next/server";
import { createMollieClient, SequenceType } from "@mollie/api-client";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { payments } from "@/db/schema";
import db from "@/db/drizzle";

const mollieClient = createMollieClient({
    apiKey: "test_dznA9FJQgzECv3hGQahegxmMAWsMBM",
});

const plans = [
    {
        name: "Basic Plan",
        description: "7 days access",
        amount: "10.00",
        interval: "7 days",
    },
    {
        name: "Pro Plan",
        description: "14 days access",
        amount: "20.00",
        interval: "14 days",
    },
    {
        name: "Premium Plan",
        description: "28 days access",
        amount: "30.00",
        interval: "28 days",
    },
];

export const POST = async (req: Request) => {
    try {
        const { userId }: any = await auth();
        const user: any = await currentUser();

        if (!userId || !user) {
            return NextResponse.json(
                { error: "Unauthorized. User not signed in." },
                { status: 401 }
            );
        }

        const { planNumber } = await req.json();

        if (planNumber === undefined || !plans[planNumber]) {
            return NextResponse.json(
                { error: "Invalid plan number provided." },
                { status: 400 }
            );
        }

        const plan = plans[planNumber];

        const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (!email) {
            return NextResponse.json(
                { error: "Email not found for the user." },
                { status: 400 }
            );
        }

        // Create a Mollie customer
        const customer = await mollieClient.customers.create({
            name: name || "Unknown User",
            email,
        });

        // Create a Mollie payment
        const payment: any = await mollieClient.payments.create({
            amount: { currency: "EUR", value: plan.amount },
            description: plan.description,
            redirectUrl: "https://lingo-henna.vercel.app/thankyou",
            webhookUrl: "https://lingo-henna.vercel.app/api/webhook",
            customerId: customer.id,
            sequenceType: SequenceType.first,
            metadata: {
                userId, // Save the Clerk user ID in the metadata
                planName: plan.name,
            },
        });

        return NextResponse.json(
            {
                message: `${plan.name} Checkout URL created successfully.`,
                checkoutUrl: payment.getCheckoutUrl(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating payment:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

// Function to calculate the number of days between two dates
function calculateDaysFrom(dateString: string): number | null {
    const inputDate = new Date(dateString);
    if (isNaN(inputDate.getTime())) {
        console.error(
            "Invalid date format. Please use a valid ISO date string."
        );
        return null;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const differenceInMilliseconds = today.getTime() - inputDate.getTime();
    const daysDifference = Math.floor(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    return daysDifference;
}

async function seedTestPayment(userId: any) {
    try {
        // Check if a payment record already exists for this user
        const existingPayment: any = await db
            .select()
            .from(payments)
            .where(eq(payments.userId, userId))
            .limit(1);

        if (existingPayment.length > 0) {
            console.log(
                `Payment already exists for user ${userId}. No new record created.`
            );
        } else {
            const newPayment = await db
                .insert(payments)
                .values({
                    userId,
                    amount: "99.99",
                    currency: "USD",
                    status: "paid",
                    planType: "Premium Plan",
                })
                .returning();

            console.log("Inserted Payment:", newPayment);
        }
    } catch (error) {
        console.error("Error inserting test payment:", error);
    }
}

export const GET = async (req: Request) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized. User not signed in." },
                { status: 401 }
            );
        }

        // Fetch payments for the authenticated user
        const userPayments = await db
            .select()
            .from(payments)
            .where(eq(payments.userId, userId))
            .limit(1);

        if (userPayments.length === 0) {
            return NextResponse.json(
                { payment: null, redirect: true },
                { status: 200 }
            );
        }

        const payment: any = userPayments[0];

        // Check if the payment status is 'paid'
        if (payment.status !== "paid") {
            return NextResponse.json(
                {
                    payment: null,
                    redirect: true,
                    message: "Payment not completed.",
                },
                { status: 200 }
            );
        }

        const daysSincePayment: number | null = calculateDaysFrom(
            payment.createdAt
        );
        let basePlanDays: number;
        let exams: number;

        // Determine the plan duration based on the plan type
        switch (payment.planType) {
            case "Basic Plan":
                basePlanDays = 7;
                exams = 3;
                break;
            case "Pro Plan":
                basePlanDays = 14;
                exams = 6;
                break;
            case "Premium Plan":
                basePlanDays = 28;
                exams = 14;
                break;
            default:
                basePlanDays = 0; // Unknown plan type
                exams = 0;
                break;
        }

        // Add extra days count to the base plan days
        const extraDays = payment.extraDays || 0;
        const totalPlanDays = basePlanDays + extraDays;

        // Calculate package expiration date/time using the total plan days
        const createdAtDate = new Date(payment.createdAt);
        const packageExpireDate = new Date(createdAtDate);
        packageExpireDate.setDate(createdAtDate.getDate() + totalPlanDays);

        // Format the packageExpireDate as "YY/MM/DD at HH:mm"
        const formattedPackageExpireDate = `${packageExpireDate
            .getFullYear()
            .toString()
            .slice(-2)}/${String(packageExpireDate.getMonth() + 1).padStart(
            2,
            "0"
        )}/${String(packageExpireDate.getDate()).padStart(2, "0")} at ${String(
            packageExpireDate.getHours()
        ).padStart(2, "0")}:${String(packageExpireDate.getMinutes()).padStart(
            2,
            "0"
        )}`;

        // Calculate days left using the total plan days
        const daysLeft = totalPlanDays - (daysSincePayment || 0);

        if (daysLeft <= 0) {
            // Delete the payment record if the plan has expired
            await db.delete(payments).where(eq(payments.id, payment.id));

            return NextResponse.json(
                {
                    payment: null,
                    redirect: true,
                    message:
                        "Payment record deleted after exceeding the plan duration.",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                payment,
                redirect: false,
                daysLeft: daysLeft > 0 ? daysLeft - 1 : daysLeft,
                totalDays: totalPlanDays,
                message: `You have ${daysLeft} day(s) left in your ${payment.planType}.`,
                exams,
                packageExpireDate: packageExpireDate.toISOString(),
                formattedPackageExpireDate,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user payments:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
