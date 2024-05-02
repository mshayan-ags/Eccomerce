const { MongoMemoryServer } = require("mongodb-memory-server");

async function main() {
	const mongod = await MongoMemoryServer.create({
		instance: { port: 27017, dbName: "metropolitan" },
	});
	console.log("MONGO_READY", mongod.getUri());

	process.on("SIGTERM", async () => {
		await mongod.stop();
		process.exit(0);
	});
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
