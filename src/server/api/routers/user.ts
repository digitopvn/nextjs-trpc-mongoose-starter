import { makeSlug } from "diginext-utils/dist/Slug";
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
			const isEmailExisted = await ctx.query.user.count({ email: input.email });
			if (isEmailExisted > 0) return { error: `Email is existed.` };

			const username = input.username || makeSlug(input.name, { delimiter: "" });
			const isUsernameExisted = await ctx.query.user.count({ username });
			if (isUsernameExisted > 0) return { error: `Username is existed.` };

			const data = await ctx.query.user.create({ ...input, username });
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
		.input(
			z
				.object({
					id: z.string().optional(),
					username: z.string().optional(),
					search: z.enum(["true", "false"]).optional(),
				})
				.optional()
		)
		.output(
			z.object({
				status: z.number(),
				data: z.any().optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			console.log("input :>> ", input);
			const data = await ctx.query.user.find(input);
			return respondSuccess({ data });
		}),
	getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const data = await ctx.query.user.findOne({ _id: input });
		return data;
	}),
});

export default userRouter;
