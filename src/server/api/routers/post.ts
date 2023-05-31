import { z } from "zod";

import { respondSuccess, zResponse } from "@/interfaces/ResponseData";
import { parseRequestFilter } from "@/plugins/parse-request-filter";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { zPost, zPostCreate, zPostQuery } from "@/server/entities";

const postRouter = createTRPCRouter({
	create: protectedProcedure.input(zPostCreate).mutation(async ({ ctx, input }) => {
		ctx.query.post.user = ctx.session.user;

		const data = await ctx.query.post.create({ ...input });
		return data;
	}),
	createApi: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/posts",
				tags: ["Posts"],
				summary: "Create new post",
				protect: true,
			},
		})
		.input(zPostCreate)
		.output(zResponse(zPost.nullable()))
		.mutation(async ({ ctx, input }) => {
			ctx.query.post.user = ctx.session.user;
			const data = await ctx.query.post.create({ ...input });
			return respondSuccess({ data });
		}),
	list: publicProcedure.input(zPostQuery).query(async ({ ctx, input }) => {
		const data = await ctx.query.post.find(input);
		return data;
	}),
	listApi: publicProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/posts",
				tags: ["Posts"],
				summary: "Get all posts",
				// protect: true,
			},
		})
		.input(zPostQuery)
		.output(zResponse(z.array(z.any())))
		.query(async ({ ctx, input }) => {
			const { filter, options } = parseRequestFilter(input);

			const data = await ctx.query.post.find(filter, options);
			console.log("data :>> ", data);

			return respondSuccess({ data });
		}),
	getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const data = await ctx.query.post.findOne({ id: input });
		return data;
	}),
});

export default postRouter;
