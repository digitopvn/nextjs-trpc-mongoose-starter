import { z } from "zod";

import { respondSuccess } from "@/interfaces/ResponseData";
import { parseRequestFilter } from "@/plugins/parse-request-filter";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

const postRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				title: z.string(),
				content: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
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
		.input(
			z.object({
				name: z.string(),
				title: z.string(),
				content: z.string(),
			})
		)
		.output(
			z.object({
				status: z.number(),
				data: z.any().optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			ctx.query.post.user = ctx.session.user;

			const data = await ctx.query.post.create({ ...input });
			return respondSuccess({ data });
		}),
	list: publicProcedure
		.input(
			z
				.object({
					_id: z.string().optional(),
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
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
		.input(
			z
				.object({
					populate: z.string().optional(),
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
			const { filter, options } = parseRequestFilter(input);

			const data = await ctx.query.post.find(filter, options);
			return respondSuccess({ data });
		}),
	getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const data = await ctx.query.post.findOne({ _id: input });
		return data;
	}),
});

export default postRouter;
