const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const app = express()
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mongo-simple-crud.tzwys72.mongodb.net/?appName=Mongo-simple-crud`;



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        await client.connect();
        const db = client.db("ElectroHub");
        const devicesCollections = db.collection("devices");
        const usersCollection = db.collection("users");
        const userAddCardCollection = db.collection("cards");
        const orderFormCollection = db.collection("orders");


        app.post("/users", async (req, res) => {
            const user = req.body;
            user.role = "user";
            user.createdAt = new Date();

            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });
        app.patch("/users/:id", async (req, res) => {
            const { id } = req.params;
            const { role } = req.body;

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { role } }
            );
            res.send(result);
        });



        app.post('/devices', async (req, res) => {
            const newFood = req.body;
            const result = await devicesCollections.insertOne(newFood);
            res.send(result)
        });

        app.get('/devices', async (req, res) => {
            const cursor = devicesCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        });
        app.get('/devices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await devicesCollections.findOne(query);
            res.send(result);
        });
        app.patch('/devices/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const body = { ...req.body };
                delete body._id;

                const filter = { _id: new ObjectId(id) };
                const updateDoc = { $set: body };

                const result = await devicesCollections.updateOne(filter, updateDoc);
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error', details: err.message });
            }
        });


        app.delete("/devices/:id", async (req, res) => {
            const id = req.params.id;

            const result = await devicesCollections.deleteOne({
                _id: new ObjectId(id),
            });

            res.send(result);
        });





        // Add To Card
        app.post("/cards", async (req, res) => {
            const newCard = req.body;
            const result = await userAddCardCollection.insertOne(newCard);
            res.send(result);
        });

        // Get user cards
        app.get("/cards", async (req, res) => {
            const email = req.query.email;
            let query = {};

            if (email) {
                query.userEmail = email; // filter by email
            }

            const cursor = userAddCardCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/cards/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userAddCardCollection.findOne(query);
            res.send(result);
        });
        app.patch("/update-paid-status", async (req, res) => {
            try {
                const { productIds, userEmail } = req.body;

                if (!productIds || !productIds.length || !userEmail)
                    return res.status(400).send({ error: "Invalid request" });

                const objectIds = productIds.map(id => new ObjectId(id));

                const result = await userAddCardCollection.updateMany(
                    { _id: { $in: objectIds }, userEmail },
                    { $set: { status: "paid" } }
                );

                res.send({ modifiedCount: result.modifiedCount });
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: err.message });
            }
        });

        app.delete('/cards/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userAddCardCollection.deleteOne(query);
            res.send(result);
        });



        app.post('/orders', async (req, res) => {
            const newFood = req.body;
            const result = await orderFormCollection.insertOne(newFood);
            res.send(result)
        });

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            let query = {};

            if (email) {
                query.userEmail = email; // filter by email
            }

            const cursor = orderFormCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        app.get('/orders/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const order = await orderFormCollection.findOne(filter);

                if (!order) {
                    return res.status(404).send({ error: 'Order not found' });
                }

                res.send(order);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error', details: err.message });
            }
        });
        app.patch('/orders/:id/confirm', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };

                // প্রথমে order টি fetch করুন
                const order = await orderFormCollection.findOne(filter);

                if (!order) {
                    return res.status(404).send({ error: 'Order not found' });
                }

                // Order status update করুন
                const updateDoc = {
                    $set: {
                        status: "confirmed",
                        confirmedAt: new Date()
                    }
                };

                const result = await orderFormCollection.updateOne(filter, updateDoc);

                // Order confirm হওয়ার পরে cart থেকে product remove করুন
                if (result.modifiedCount > 0 && order.customer?.email && order.products) {
                    const userEmail = order.customer.email;

                    // প্রতিটি product এর জন্য card থেকে remove করুন
                    for (const product of order.products) {
                        try {
                            await cardCollection.deleteOne({
                                email: userEmail,
                                productId: product.productId
                            });
                        } catch (cardErr) {
                            console.error(`Error removing product ${product.productId} from cart:`, cardErr);
                        }
                    }
                }

                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error', details: err.message });
            }
        });
        app.patch('/orders/:id/confirm', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const updateDoc = {
                    $set: {
                        status: "confirmed",
                        confirmedAt: new Date()
                    }
                };

                const result = await orderFormCollection.updateOne(filter, updateDoc);
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ error: 'Internal Server Error', details: err.message });
            }
        });
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderFormCollection.deleteOne(query);
            res.send(result);
        });









        app.post("/create-checkout-session", async (req, res) => {
            try {
                const { cost, userEmail, userName, userId, items } = req.body;

                if (!cost || !items) {
                    return res.status(400).send({ error: "Invalid payment data" });
                }

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "usd",
                                unit_amount: Number(cost) * 100,
                                product_data: {
                                    name: `Cart Payment (${items.length} items)`,
                                },
                            },
                            quantity: 1,
                        },
                    ],
                    customer_email: userEmail,
                    mode: "payment",
                    metadata: {
                        userId,
                        userEmail,
                        items: JSON.stringify(items),
                    },
                    success_url: `${process.env.SITE_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/payment-cancelled`,
                });

                res.send({ url: session.url });
            } catch (error) {
                console.error("Stripe Error:", error.message);
                res.status(500).send({ error: error.message });
            }
        });


        app.get("/payment-success", async (req, res) => {
            try {
                const sessionId = req.query.session_id;

                const session = await stripe.checkout.sessions.retrieve(sessionId);

                if (session.payment_status !== "paid") {
                    return res.send("Payment not completed");
                }

                const items = JSON.parse(session.metadata.items);

                for (const item of items) {
                    await userAddCardCollection.updateOne(
                        { _id: new ObjectId(item._id) },
                        { $set: { status: "paid" } }
                    );
                }

                res.redirect(`${process.env.SITE_DOMAIN}/payment-success-page`);
            } catch (error) {
                res.status(500).send("Payment processing failed");
            }
        });






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Electro-hub!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
