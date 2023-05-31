import { makeSlug } from "diginext-utils/dist/Slug";
import { z } from "zod";

import { respondSuccess, zResponse } from "@/interfaces/ResponseData";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { zUser, zUserCreate, zUserQuery } from "@/server/entities";

const userRouter = createTRPCRouter({
	create: publicProcedure.input(zUserCreate).mutation(async ({ ctx, input }) => {
		const isEmailExisted = await ctx.query.user.count({ email: input.email });
		if (isEmailExisted > 0) return { error: `Email is existed.` };

		const username = input.username || makeSlug(input.name, { delimiter: "" });
		const isUsernameExisted = await ctx.query.user.count({ username });
		if (isUsernameExisted > 0) return { error: `Username is existed.` };

		const data = await ctx.query.user.create({ ...input, username });
		return data;
	}),
	list: publicProcedure.input(zUser.partial().optional()).query(async ({ ctx, input }) => {
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
		.input(zUserQuery)
		.output(zResponse(z.array(z.any())))
		.query(async ({ ctx, input }) => {
			const data = await ctx.query.user.find(input);
			return respondSuccess({ data });
		}),
	getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const data = await ctx.query.user.findOne({ id: input });
		return data;
	}),
});

export default userRouter;
