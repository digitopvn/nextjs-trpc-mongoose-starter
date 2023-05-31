import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const customerRouter = createTRPCRouter({
	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.query.customer.find();
	}),
});

export default customerRouter;
