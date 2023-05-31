import { createTRPCRouter } from "@/server/api/trpc";

import customerRouter from "./routers/customer";
import { exampleRouter } from "./routers/example";
import pageRouter from "./routers/page";
import userRouter from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	example: exampleRouter,
	users: userRouter,
	pages: pageRouter,
	customers: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
