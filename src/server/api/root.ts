import { createTRPCRouter } from "@/server/api/trpc";

import { domainRouter } from "./routers/domain";
import { emailRouter } from "./routers/email";
import { exampleRouter } from "./routers/example";
import { githubRouter } from "./routers/github";
import packageRouter from "./routers/package";
import subscriptionRouter from "./routers/subscription";
import userRouter from "./routers/user";
import workspaceRouter from "./routers/workspace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	example: exampleRouter,
	github: githubRouter,
	users: userRouter,
	workspaces: workspaceRouter,
	packages: packageRouter,
	subscriptions: subscriptionRouter,
	domains: domainRouter,
	email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
