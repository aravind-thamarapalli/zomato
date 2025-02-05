const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = "your_mongodb_connection_string";
let db;

const connectDB = async () => {
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('zomato'); // Change 'zomato' to your database name
    console.log("✅ Connected to MongoDB");
};

const getDB = () => {
    if (!db) throw new Error("❌ Database not initialized");
    return db;
};

module.exports = { connectDB, getDB };
