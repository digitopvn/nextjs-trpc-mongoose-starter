import { makeSlug } from "diginext-utils/dist/Slug";
import { z } from "zod";

import { respondFailure, respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import generateRandomString from "@/server/helpers/generate-random-string";

const userRouter = createTRPCRouter({
	register: publicProcedure
		// .meta({
		// 	openapi: {
		// 		method: "POST",
		// 		path: "/register",
		// 		tags: ["General"],
		// 		summary: "Registration",
		// 	},
		// })
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
				image: z.string().optional(),
				username: z.string().optional(),
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
			const isEmailExisted = await ctx.prisma.user.count({ where: { email: input.email } });
			if (isEmailExisted) return respondFailure(`Email is existed.`);

			let username = input.username || makeSlug(input.name);
			const isUsernameExisted = await ctx.prisma.user.count({ where: { username } });
			if (isUsernameExisted) username = makeSlug(`${username}-${generateRandomString(3)}`);

			try {
				const data = await ctx.prisma.user.create({ data: { ...input, username } });
				return respondSuccess({ data });
			} catch (e: any) {
				return respondFailure(e.toString());
			}
		}),
	list: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.prisma.user.findMany();
		return respondSuccess({ data });
	}),
	getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		const data = await ctx.prisma.user.findFirst({
			where: {
				id: input,
			},
		});
		return respondSuccess({ data });
	}),
});

export default userRouter;
