import { z } from "zod";

import { respondSuccess } from "@/interfaces/ResponseData";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const userRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				image: z.string().optional(),
				username: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const isEmailExisted = await ctx.query.user.count({ where: { email: input.email } });
			if (isEmailExisted) return { error: `Email is existed.` };

			const data = await ctx.query.user.create({ data: { ...input } });
			return data;
		}),
	list: publicProcedure
		.input(
			z
				.object({
					_id: z.string().optional(),
					name: z.string().optional(),
					username: z.string().optional(),
					email: z.string().optional(),
					image: z.string().optional(),
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.query.user.find(input);
			return data;
		}),
	listApi: publicProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/users",
				tags: ["Users"],
				summary: "Get all users",
				// protect: true,
			},
		})
		.input(z.object({}).optional())
		.output(
			z.object({
				status: z.number(),
				data: z.any().optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.query.user.find(input);
			return respondSuccess({ data });
		}),
	getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const data = await ctx.query.user.findOne({ _id: input });
		return data;
	}),
});

export default userRouter;
