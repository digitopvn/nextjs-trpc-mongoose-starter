import { logError, logSuccess } from "diginext-utils/dist/console/log";
import mongoose from "mongoose";

import { env } from "@/env.mjs";

import type { IUser } from "./entities";
import { userSchema } from "./entities";
import QueryService from "./services/QueryService";

export interface QueryDatabase {
	isConnected: boolean;
	connect: (onConnected?: ((db?: typeof mongoose) => void) | undefined) => Promise<void>;
	disconnect: () => Promise<void>;
	user: QueryService<IUser>;
}

//

const globalForPrisma = globalThis as unknown as { db: QueryDatabase };

export const db = globalForPrisma.db || {
	isConnected: false,
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	connect,
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	disconnect,
	// db query services
	user: new QueryService(userSchema),
};

//

async function connect(onConnected?: () => void) {
	if (db.isConnected) return;

	if (!env.DB_URL) throw new Error(`Unable to connect database: DATABASE_URL is required.`);

	try {
		await mongoose.connect(env.DB_URL, { dbName: env.DB_NAME });

		db.isConnected = true;

		// const dataSource = await appDataSource.initialize();
		logSuccess("[DATABASE] MongoDB is connected!");

		// Gracefully close connection
		process.on("SIGINT", () => mongoose.connection.close());

		// optional callback
		if (typeof onConnected !== "undefined") onConnected();
	} catch (e) {
		console.error(e);
		process.exit(1); // passing 1 - will exit the proccess with error
	}
}

async function disconnect() {
	try {
		await mongoose.disconnect();
	} catch (e) {
		logError(e);
	}
}

if (env.NODE_ENV !== "production") globalForPrisma.db = db;
