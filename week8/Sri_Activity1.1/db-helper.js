const { MongoClient } = require("mongodb");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI); // MongoClient is used to connect to MongoDB.
async function connectDB() {
try {
await client.connect(); // client.connect() establishes the connection.
console.log("Connected to MongoDB");
} catch (err) {
console.error("MongoDB connection error:", err);
}
}
connectDB();