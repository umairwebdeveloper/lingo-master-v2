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
        name: "Basis",
        amount: "29.99",
        description: "14 dagen toegang, 4 CBR exammodules",
        interval: "14 days",
    },
    {
        name: "Expert",
        amount: "49.99",
        description: "31 dagen toegang, 10 CBR exammodules",
        interval: "31 days",
    },
    {
        name: "Gevorderd",
        amount: "39.99",
        description: "21 dagen toegang, 7 CBR exammodules",
        interval: "21 days",
    },
];

export const POST = async (req: Request) => {
    try {
        // Authenticate user
        const { userId }: any = await auth();
        const user: any = await currentUser();

        if (!userId || !user) {
            return NextResponse.json(
                { error: "Unauthorized. User not signed in." },
                { status: 401 }
            );
        }

        // Extract request body
        const { planNumber, auto } = await req.json();

        // Validate inputs
        if (typeof planNumber !== "number" || !plans[planNumber]) {
            return NextResponse.json(
                { error: "Invalid plan number provided." },
                { status: 400 }
            );
        }
        if (typeof auto !== "boolean") {
            return NextResponse.json(
                { error: "Invalid auto flag provided." },
                { status: 400 }
            );
        }

        const plan = plans[planNumber];

        // Build metadata
        const name =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Unknown User";
        const email = user.emailAddresses?.[0]?.emailAddress;
        if (!email) {
            return NextResponse.json(
                { error: "Email not found for the user." },
                { status: 400 }
            );
        }

        // Create Mollie customer
        const customer = await mollieClient.customers.create({ name, email });

        // Create Mollie payment
        const payment: any = await mollieClient.payments.create({
            amount: { currency: "EUR", value: plan.amount },
            description: plan.description,
            redirectUrl: "https://lingo-henna.vercel.app/thankyou",
            webhookUrl: "https://lingo-henna.vercel.app/api/webhook",
            customerId: customer.id,
            sequenceType: SequenceType.first,
            metadata: {
                userId,
                planName: plan.name,
                auto,
            },
        });

        return NextResponse.json(
            {
                message: `${plan.name} checkout URL created successfully.`,
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
                { payment: null, redirect: true, isExpired: true },
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
                    isExpired: true,
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
            case "Basic":
                basePlanDays = 21;
                exams = 4;
                break;
            case "Expert":
                basePlanDays = 31;
                exams = 10;
                break;
            case "Gevorderd":
                basePlanDays = 14;
                exams = 7;
                break;
            default:
                basePlanDays = 0;
                exams = 0;
                break;
        }

        // Add extra days to the base plan
        const extraDays = payment.extraDays || 0;
        const totalPlanDays = basePlanDays + extraDays;

        // Calculate expiration date/time
        const createdAtDate = new Date(payment.createdAt);
        const packageExpireDate = new Date(createdAtDate);
        packageExpireDate.setDate(createdAtDate.getDate() + totalPlanDays);

        // Format expiration date
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

        // Calculate days left
        const daysLeft = totalPlanDays - (daysSincePayment || 0);
        const isExpired = daysLeft <= 0;

        if (isExpired) {
            // Remove expired payment
            await db.delete(payments).where(eq(payments.id, payment.id));

            return NextResponse.json(
                {
                    payment: null,
                    redirect: true,
                    isExpired: true,
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
                isExpired: false,
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
