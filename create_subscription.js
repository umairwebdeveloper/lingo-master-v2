const { createMollieClient } = require("@mollie/api-client");

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

async function createCustomer() {
    const customer = await mollieClient.customers.create({
        name: "John Doe",
        email: "umairashraf5252@gmail.com",
    });

    console.log(customer);
    return customer.id;
}

async function createSubscription(customerId, plan) {
    try {
        const subscription = await mollieClient.customerSubscriptions.create({
            customerId: customerId,
            amount: {
                currency: "EUR",
                value: plan.amount, // Price of the plan
            },
            interval: plan.interval, // Recurring interval (e.g., "7 days")
            description: plan.description,
            webhookUrl: "https://lingo-henna.vercel.app/webhook", // Handle payment status updates
        });

        console.log(subscription);
    } catch (error) {
        console.error(`Error creating subscription for ${plan.name}:`, error);
    }
}

(async () => {
    for (const plan of plans) {
        const customerId = await createCustomer();
        await createSubscription(customerId, plan);
    }
})();



// Basic Plan Checkout URL: https://www.mollie.com/checkout/select-method/U5YfcrrPJ6
// Pro Plan Checkout URL: https://www.mollie.com/checkout/select-method/VpAfupXR6W
// Premium Plan Checkout URL: https://www.mollie.com/checkout/select-method/FtBpdf4Tvy