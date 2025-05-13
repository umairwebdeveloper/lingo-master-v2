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

async function createPayment(plan) {
    try {
        const customer = await mollieClient.customers.create({
            name: "Jane Doe",
            email: "umairashraf5252@gmail.com",
        });
        const payment = await mollieClient.payments.create({
            amount: { currency: "EUR", value: plan.amount },
            description: plan.description,
            redirectUrl: "https://f702-39-58-255-179.ngrok-free.app/thankyou",
            webhookUrl: "https://f702-39-58-255-179.ngrok-free.app/api/webhook",
            customerId: customer.id,
            sequenceType: "first",
            // profileId: "pfl_GMgjTzdmZd",
        });

        console.log(`${plan.name} Checkout URL:`, payment.getCheckoutUrl());
        return payment.getCheckoutUrl();
    } catch (error) {
        console.error(`Error creating payment for ${plan.name}:`, error);
    }
}

(async () => {
    for (const plan of plans) {
        await createPayment(plan);
    }
})();



// Basic Plan Checkout URL: https://www.mollie.com/checkout/credit-card/embedded/ByzhKczCv6
// Pro Plan Checkout URL: https://www.mollie.com/checkout/credit-card/embedded/Bn9abB2LEC
// Premium Plan Checkout URL: https://www.mollie.com/checkout/credit-card/embedded/WMp6aMh2Jo