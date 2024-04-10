const Express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { initSocket } = require("./socket");

const app = Express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(helmet());
app.use(
	cors({
		origin: allowedOrigins.length > 0 ? allowedOrigins : true,
		credentials: true,
	})
);
// Stripe's webhook needs the raw, unparsed body to verify its signature, so
// it must be excluded from the global JSON body parser - StripeWebhook.js
// applies its own express.raw() to that one route instead.
app.use((req, res, next) => {
	if (req.originalUrl === "/Stripe-Webhook") return next();
	return Express.json({ limit: "10mb" })(req, res, next);
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(mongoSanitize());

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { status: 429, message: "Too many attempts, please try again later" },
});
app.use(["/Login", "/Login-Admin", "/Forget-Password", "/Resend-OTP", "/Verify-OTP", "/Reset-Password", "/Guest-Checkout"], authLimiter);

const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);
const io = initSocket(httpServer, allowedOrigins);

module.exports = {
	httpServer,
	port,
	app,
	io,
};
