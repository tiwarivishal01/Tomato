import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/', (req, res) => {
    res.send("API is running");
});

app.post('/api/checkout', async (req, res) => {
    try {
        const { items } = req.body;
        // WARNING: In an actual production environment, you should verify the item.price against a database
        // instead of blindly trusting the price requested by the frontend payload.

        const line_items = items.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    // Stripe requires the amount in the smallest denominator (paise).
                    // Our frontend displayed price is `item.price * 10` INR.
                    // To convert to Paise, we multiply by 100.
                    unit_amount: item.price * 10 * 100
                },
                quantity: item.quantity
            }
        });

        // Add dummy shipping fee line item if you want, or just the food
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Fee" },
                unit_amount: 50 * 100 // ₹50 delivery
            },
            quantity: 1
        });

        const origin = req.headers.origin || 'http://localhost:5173';
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.json({ success: false, message: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
