import { makeSlug } from "diginext-utils/dist/Slug";
import { z } from "zod";

import { respondFailure, respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import generateRandomString from "@/server/helpers/generate-random-string";

const packageRouter = createTRPCRouter({
	create: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/packages",
				tags: ["Package"],
				summary: "Create new package",
				protect: true,
			},
		})
		.input(
			z.object({
				name: z.string(),
				price: z.number(),
				type: z.enum(["hobby", "self_hosted", "on_premise"]),
				quota: z.object({
					projects: z.number(),
					apps: z.number(),
					concurrentBuilds: z.number(),
					containerSize: z.number(),
				}),
				currency: z.string(),
				userId: z.string().optional(),
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
			const userId = input.userId || ctx.session?.user.id;
			const slug = makeSlug(input.name);
			const data = await ctx.prisma.package.create({ data: { ...input, slug, userId } });
			return respondSuccess({ data });
		}),
	list: publicProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/packages",
				tags: ["Package"],
				summary: "List of subscription packages",
			},
		})
		.input(z.void())
		.output(
			z.object({
				status: z.number(),
				data: z.any(),
				messages: z.array(z.string()).optional(),
			})
		)
		.query(async ({ ctx }) => {
			// console.log("ctx.prisma.package :>> ", ctx.prisma.package);
			const data = await ctx.prisma.package.findMany();
			return respondSuccess({ data });
		}),
	rxList: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.prisma.package.findMany();
		return data;
	}),
	getById: publicProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/packages/{id}",
				tags: ["Package"],
				summary: "Get subscription package by ID",
			},
		})
		.input(z.object({ id: z.string() }))
		.output(
			z.object({
				status: z.number(),
				data: z.any().optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			const data = await ctx.prisma.package.findFirst({
				where: { id: input.id },
			});
			return respondSuccess({ data });
		}),
	updateById: protectedProcedure
		.meta({
			openapi: {
				method: "PATCH",
				path: "/packages/{id}",
				tags: ["Package"],
				summary: "Update subscription package by ID",
				protect: true,
			},
		})
		.input(
			z.object({
				id: z.string(),
				name: z.string().optional(),
				userId: z.string().optional(),
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
			const { id, ...updateData } = input;
			const data = await ctx.prisma.package.update({
				where: { id },
				data: updateData,
			});
			return respondSuccess({ data });
		}),
	deleteById: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: "/packages/{id}",
				tags: ["Package"],
				summary: "Delete subscription package by ID",
				protect: true,
			},
		})
		.input(
			z.object({
				id: z.string(),
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
			const { id } = input;
			const data = await ctx.prisma.package.delete({ where: { id } });
			return respondSuccess({ data });
		}),
	subscribe: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/packages/subscribe/{id}",
				tags: ["Package"],
				summary: "Subscribe to a subscription package by ID",
				protect: true,
			},
		})
		.input(
			z.object({
				id: z.string(),
				userId: z.string().optional(),
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
			const userId = input.userId || ctx.session?.user.id;
			const { id } = input;

			const user = await ctx.prisma.user.findFirst({ where: { id: userId } });
			if (!user) return respondFailure(`User not found.`);

			const pkg = await ctx.prisma.package.findFirst({ where: { id } });
			if (!pkg) return respondFailure(`Subscription package not found.`);

			const subscription = await ctx.prisma.subscription.create({
				data: {
					name: `User "${user?.name}" has subscribed to "${pkg.name}" package.`,
					slug: makeSlug(`${user.name} ${pkg.name}`),
					key: generateRandomString(64),
					packageId: pkg.id,
					paid: pkg.price,
					currency: pkg.currency,
					userId,
				},
			});
			return respondSuccess({ data: subscription });
		}),
});

export default packageRouter;
