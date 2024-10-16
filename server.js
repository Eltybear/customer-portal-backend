// server.js

// 1. Import required packages
const express = require('express'); // Express framework for server
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const bcrypt = require('bcryptjs'); // Library for password hashing
const cors = require('cors'); // Middleware for enabling CORS
const stripe = require('stripe')('sk_test_51QAXFVAt07LuYc9i2kmkhHddJ96QU8cfCTtLpyCkcR70au2edw7vjI4sgbtNcXu9tMhabiE2nHiPJocEgsh1hVZl00uA8XZxdr'); // Stripe secret key

// 2. Initialize Express application
const app = express(); // Create an instance of an Express app
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// 3. Registration endpoint (Question 1)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation using RegEx (Question 2)
    const usernameRegex = /^[a-zA-Z0-9]{3,30}$/; // Alphanumeric username between 3-30 characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, 1 letter and 1 number

    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Invalid username.' });
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one letter and one number.' });
    }

    // Password hashing and salting (Question 1)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Here you would save the username and hashedPassword to your database
    console.log(`Registered user: ${username}, Password: ${hashedPassword}`);

    res.json({ message: 'User registered successfully!' });
});

// 4. Payment endpoint (Question 4)
app.post('/payment', async (req, res) => {
    const { amount, token } = req.body;

    try {
        // Create a new charge using Stripe
        const charge = await stripe.charges.create({
            amount: amount, // Amount in cents
            currency: 'usd', // Currency
            source: token, // Token obtained from Stripe.js
            description: 'Payment for order', // Description of the charge
        });

        res.json({ message: 'Payment successful!', charge });
    } catch (error) {
        res.status(500).json({ message: 'Payment failed!', error: error.message });
    }
});

// 5. Start server and listen on port 5000
const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
