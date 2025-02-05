const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const restaurantRoutes = require('./routes/restaurants');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/restaurants', restaurantRoutes);

app.get('/', (req, res) => {
    res.send("🍽️ Zomato Restaurant API is running!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
