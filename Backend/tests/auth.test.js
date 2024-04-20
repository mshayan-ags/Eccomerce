process.env.JWT_SECRET = "test-only-secret";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test";
process.env.STRIPE_SECRET_KEY = "sk_test_dummy";

const request = require("supertest");
const bcrypt = require("bcryptjs");

jest.mock("../models/User");
jest.mock("../models/Admin");

const { User } = require("../models/User");
const { app } = require("../Middlewares/Server");
require("../Middlewares/Routes");

// Regression test for the auth-bypass bug: `bcrypt.compare` was called
// without `await`, so the returned Promise (always truthy) made every
// password check pass regardless of what was submitted.
describe("POST /Login", () => {
	const password = "correct-horse-battery-staple";
	const passwordHash = bcrypt.hashSync(password, 4);

	function mockUserLookup() {
		User.findOne.mockReturnValue({
			select: jest.fn().mockResolvedValue({ _id: "507f1f77bcf86cd799439011", password: passwordHash })
		});
	}

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("rejects an incorrect password", async () => {
		mockUserLookup();

		const res = await request(app)
			.post("/Login")
			.send({ email: "user@example.com", password: "definitely-wrong" });

		expect(res.status).toBe(401);
		expect(res.body.token).toBeUndefined();
	});

	it("rejects an empty password", async () => {
		mockUserLookup();

		const res = await request(app)
			.post("/Login")
			.send({ email: "user@example.com", password: "" });

		expect(res.status).toBe(400);
	});

	it("accepts the correct password", async () => {
		mockUserLookup();

		const res = await request(app)
			.post("/Login")
			.send({ email: "user@example.com", password });

		expect(res.status).toBe(200);
		expect(res.body.token).toBeDefined();
	});
});
