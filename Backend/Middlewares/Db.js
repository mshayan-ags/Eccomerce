const mongoose = require("mongoose");
const Stripe = require("stripe");

if (!process.env.MONGODB_URI) {
	throw new Error("MONGODB_URI is not set. Copy .env.example to .env and fill it in.");
}
if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error("STRIPE_SECRET_KEY is not set. Copy .env.example to .env and fill it in.");
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

let connectionPromise = null;

// Connects once and reuses the same connection/pool for the lifetime of the
// process. Mongoose already pools connections internally, so route handlers
// should never call this themselves - it's called once at server startup.
function connectDB() {
	if (!connectionPromise) {
		mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));
		mongoose.connection.once("connected", () => console.log("Connected to MongoDB"));

		connectionPromise = mongoose.connect(process.env.MONGODB_URI);
	}
	return connectionPromise;
}

module.exports = { connectDB, stripe };
