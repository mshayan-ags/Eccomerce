const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const ADMIN_ROOM = "admins";

function saleRoom(saleId) {
	return `sale:${saleId}`;
}

// A client can only join a given order's update room if their token proves
// they either placed that order or are an admin - otherwise "join-order"
// with a guessed id would let anyone eavesdrop on someone else's order.
function initSocket(httpServer, allowedOrigins) {
	const io = new Server(httpServer, {
		cors: {
			origin: allowedOrigins.length > 0 ? allowedOrigins : true,
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		socket.on("join-order", async ({ saleId, token }) => {
			if (!saleId || !token) return;

			try {
				const payload = jwt.verify(token, process.env.JWT_SECRET);
				const { Sale } = require("../models/Sale");
				const sale = await Sale.findOne({ _id: saleId }).select("User");
				if (!sale) return;

				const isOwner = sale.User?.toString() === payload.id;
				const isAdmin = Boolean(payload.Role);

				if (isOwner || isAdmin) {
					socket.join(saleRoom(saleId));
				}
			} catch (error) {
				// Invalid/expired token or bad id - just don't join the room.
			}
		});

		socket.on("leave-order", (saleId) => {
			if (saleId) socket.leave(saleRoom(saleId));
		});

		// Lets the Admin Panel receive "new-order" pushes - only a verified
		// admin token can join, so a customer's token can't listen in on every
		// order placed store-wide.
		socket.on("join-admin", async ({ token }) => {
			if (!token) return;

			try {
				const payload = jwt.verify(token, process.env.JWT_SECRET);
				if (!payload.Role) return;

				const { Admin } = require("../models/Admin");
				const admin = await Admin.findOne({ _id: payload.id, Role: payload.Role });
				if (admin?._id) {
					socket.join(ADMIN_ROOM);
				}
			} catch (error) {
				// Invalid/expired token - just don't join the room.
			}
		});
	});

	return io;
}

module.exports = { initSocket, saleRoom, ADMIN_ROOM };
