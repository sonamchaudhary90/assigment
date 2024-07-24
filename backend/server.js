const express = require('express');
const cors = require('cors');
const connectDB = require('./dbConnect');
const User = require('./user');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username' });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
