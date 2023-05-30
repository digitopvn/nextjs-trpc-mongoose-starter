import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Role as DbRole, Subscription, User as DbUser, Workspace } from "@prisma/client";
import { makeSlug } from "diginext-utils/dist/Slug";
import { type GetServerSidePropsContext } from "next";
import { type DefaultSession, type NextAuthOptions, getServerSession } from "next-auth";
import type { Provider } from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import type { RoutePermisionType } from "@/utils/types";

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
			// role: Role;
		} & DefaultSession["user"] &
			User &
			DbUser;
	}

	interface User {
		role?: Role;
		workspace?: Workspace;
		subscription?: Subscription;
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
				const userInDB = await prisma.user.findFirst({ where: { email: user.email }, include: { role: true } });

				// update user's default role & username
				let updatedUser:
					| (DbUser & {
							role: DbRole | null;
					  })
					| null;

				if (!userInDB?.roleId && user.email) {
					const memberRole = await prisma.role.findFirst({ where: { type: "member" } });
					const roleId = memberRole?.id;
					updatedUser = await prisma.user.update({ where: { email: user.email }, data: { roleId }, include: { role: true } });

					user.role = memberRole || undefined;
				} else {
					updatedUser = userInDB;
				}

				if (!userInDB?.username && user.email && user.name) {
					const username = makeSlug(user.name);
					updatedUser = await prisma.user.update({ where: { email: user.email }, data: { username }, include: { role: true } });
					session.user.username = username;
				} else {
					updatedUser = userInDB;
				}

				// return user data:
				session.user.id = user.id;
				session.user.username = userInDB?.username || updatedUser?.username || null;
				session.user.role = user.role || userInDB?.role || updatedUser?.role || undefined; // <-- put other properties on the session here
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
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
