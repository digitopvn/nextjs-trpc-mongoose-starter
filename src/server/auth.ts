import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { makeSlug } from "diginext-utils/dist/Slug";
import { MongoClient } from "mongodb";
import { type GetServerSidePropsContext } from "next";
import type { DefaultSession, NextAuthOptions, User } from "next-auth";
import { getServerSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import type { RoutePermisionType } from "@/utils/types";

import type { IUser } from "./entities";

/**
 * NextAuth with MongoDB Adapter
 */

if (!env.DB_URL) throw new Error('Invalid/Missing environment variable: "DB_URL"');

const uri = env.DB_URL;
const options = {};

// db.connect();

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

(globalThis as any)._mongoClientPromise = clientPromise;

if (env.NODE_ENV === "development") {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	if (!(globalThis as any)._mongoClientPromise) {
		client = new MongoClient(uri, options);
		(globalThis as any)._mongoClientPromise = client.connect();
	}
	clientPromise = (globalThis as any)._mongoClientPromise;
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

if (!clientPromise) throw new Error(`Unable to connect database.`);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			role: Role;
		} & DefaultSession["user"] &
			IUser &
			User;
	}

	interface RoleRoute {
		path: string;
		permissions: RoutePermisionType[];
	}

	interface Role {
		id: string;
		name: string;
		type: string;
		routes: RoleRoute[];
	}
}

/**
 * ...add more providers here.
 *
 * Most other providers require a bit more work than the Discord provider. For example, the
 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
 *
 * @see https://next-auth.js.org/providers/github
 */
const providers: Provider[] = [];

if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET)
	providers.push(
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		})
	);

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
	providers.push(
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
			allowDangerousEmailAccountLinking: true,
		})
	);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		async session({ session, user }) {
			console.log("[NEXT_AUTH] Session callback...");
			if (session.user) {
				const userInDB = await db.user.findOne({ email: user.email });

				// update user's default role & username
				let updatedUser: IUser | undefined;

				if (!userInDB?.username && user.email && user.name) {
					const username = makeSlug(user.name);
					updatedUser = await db.user.updateOne({ email: user.email }, { username });
					session.user.username = username;
				} else {
					updatedUser = userInDB;
				}

				// return user data:
				session.user.id = user.id;
				session.user.username = userInDB?.username || updatedUser?.username || null;
			}
			return session;
		},
	},
	adapter: MongoDBAdapter(clientPromise),
	providers,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
