import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const pageRouter = createTRPCRouter({
	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.query.page.find();
	}),
});

export default pageRouter;
