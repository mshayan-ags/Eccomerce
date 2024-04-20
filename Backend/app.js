require("dotenv").config();

const { connectDB } = require("./Middlewares/Db");
const { httpServer, port, app } = require("./Middlewares/Server");
const Routes = require("./Middlewares/Routes");

Routes;

connectDB()
	.then(() => {
		httpServer.listen(port, () => {
			console.log(`Server on http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to MongoDB, server not started:", error.message);
		process.exit(1);
	});
