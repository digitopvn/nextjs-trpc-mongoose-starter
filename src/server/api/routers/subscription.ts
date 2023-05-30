import { makeSlug } from "diginext-utils/dist/Slug";
import { z } from "zod";

import { respondFailure, respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import generateRandomString from "@/server/helpers/generate-random-string";

const subscriptionRouter = createTRPCRouter({
	subscribe: publicProcedure
		// .meta({
		// 	openapi: {
		// 		method: "POST",
		// 		path: "/subscribe",
		// 		tags: ["General"],
		// 		summary: "Subscribe to a package plan",
		// 	},
		// })
		.input(
			z.object({
				name: z.string(),
				paid: z.number(),
				packageId: z.string(),
				packageType: z.enum(["hobby", "self_hosted", "on_premise"]),
				expiredAt: z.date(),
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
			const key = generateRandomString(64);
			const slug = makeSlug(input.name);
			const subscription = await ctx.prisma.subscription.create({
				data: {
					...input,
					slug,
					key,
					userId,
				},
			});
			return respondSuccess({ data: subscription });
		}),
	rxSubscribe: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				paid: z.number(),
				packageId: z.string(),
				packageType: z.enum(["hobby", "self_hosted", "on_premise"]),
				expiredAt: z.date(),
				userId: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = input.userId || ctx.session?.user.id;
			const key = generateRandomString(64);
			const slug = makeSlug(input.name);
			const subscription = await ctx.prisma.subscription.create({
				data: {
					...input,
					slug,
					key,
					userId,
				},
			});
			return subscription;
		}),
	create: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/subscriptions",
				tags: ["Subscription"],
				summary: "Create new subscription",
				protect: true,
			},
		})
		.input(
			z.object({
				name: z.string(),
				paid: z.number(),
				packageId: z.string(),
				packageType: z.enum(["hobby", "self_hosted", "on_premise"]),
				expiredAt: z.date(),
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
			const key = generateRandomString(64);
			const slug = makeSlug(input.name);
			const subscription = await ctx.prisma.subscription.create({
				data: {
					...input,
					slug,
					key,
					userId,
				},
			});
			return respondSuccess({ data: subscription });
		}),
	list: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/subscriptions",
				tags: ["Subscription"],
				summary: "List of subscriptions",
				protect: true,
			},
		})
		.input(z.void())
		.output(
			z.object({
				status: z.number(),
				data: z.any().optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.query(async ({ ctx }) => {
			const data = await ctx.prisma.subscription.findMany();
			return respondSuccess({ data });
		}),
	rxList: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user.id;
		const data = await ctx.prisma.subscription.findMany({ where: { userId } });
		return data;
	}),
	getById: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/subscriptions/{id}",
				tags: ["Subscription"],
				summary: "Get subscription by ID",
				protect: true,
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
			const data = await ctx.prisma.subscription.findFirst({
				where: {
					id: input.id,
				},
			});
			return respondSuccess({ data });
		}),
	updateById: protectedProcedure
		.meta({
			openapi: {
				method: "PATCH",
				path: "/subscriptions/{id}",
				tags: ["Subscription"],
				summary: "Update subscription by ID",
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
			const data = await ctx.prisma.subscription.update({
				where: { id },
				data: updateData,
			});
			return respondSuccess({ data });
		}),
	deleteById: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: "/subscriptions/{id}",
				tags: ["Subscription"],
				summary: "Delete subscription by ID",
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
			const data = await ctx.prisma.subscription.delete({ where: { id } });
			return respondSuccess({ data });
		}),
	verifyKey: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/subscriptions/verify",
				tags: ["Subscription"],
				summary: "Verify subscription key (DX_KEY)",
				protect: true,
			},
		})
		.input(
			z.object({
				key: z.string(),
			})
		)
		.output(
			z.object({
				status: z.number(),
				data: z.object({ verified: z.boolean() }),
				messages: z.array(z.string()).optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { key } = input;
			const subscription = await ctx.prisma.subscription.findFirst({ where: { key } });
			const verified = subscription !== null;
			return respondSuccess({ data: { verified } });
		}),
	checkQuota: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/subscriptions/quota/check",
				tags: ["Subscription"],
				summary: "Check if the key has exceeded the quota",
				protect: true,
			},
		})
		.input(
			z.object({
				key: z.string().optional(),
				projects: z.number().optional(),
				apps: z.number().optional(),
				concurrentBuilds: z.number().optional(),
				containerSize: z.number().optional(),
			})
		)
		.output(
			z.object({
				status: z.number(),
				data: z.object({ isExceed: z.boolean(), exceeds: z.array(z.string()) }),
				messages: z.array(z.string()).optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// console.log("checking quotas > input :>> ", input);
			// console.log("checking quotas > ctx.session :>> ", ctx.session);
			// console.log("checking quotas > ctx.session.user :>> ", ctx.session.user);
			// console.log("checking quotas > key :>> ", ctx.session.user.subscription?.key);
			const key = input.key || ctx.session.user.subscription?.key;
			if (!key) return respondFailure(`DX_KEY not found.`);
			// console.log("checking quotas > key :>> ", key);

			const subscription = ctx.session.user.subscription || (await ctx.prisma.subscription.findFirst({ where: { key } }));
			if (!subscription) return respondFailure(`DX_KEY is not valid.`);
			// console.log("checking quotas > subscription :>> ", subscription);

			const pkg = await ctx.prisma.package.findFirst({ where: { id: subscription.packageId } });
			if (!pkg) return respondFailure(`DX_KEY is not valid.`);
			// console.log("checking quotas > pkg :>> ", pkg);

			// validate resource quotas
			let isExceed = false;
			const exceeds: string[] = [];

			if (
				typeof input.projects === "undefined" &&
				typeof input.apps !== "undefined" &&
				typeof input.concurrentBuilds !== "undefined" &&
				typeof input.containerSize !== "undefined"
			)
				return respondFailure(`One of these params must be specified: projects, apps, concurrentBuilds and containerSize`);

			if (typeof input.projects !== "undefined") {
				isExceed = pkg.quota.projects > -1 && input.projects >= pkg.quota.projects;
				exceeds.push("project");
			}

			if (typeof input.apps !== "undefined") {
				if (isExceed === false) isExceed = pkg.quota.apps > -1 && input.apps >= pkg.quota.apps;
				exceeds.push("app");
			}

			if (typeof input.concurrentBuilds !== "undefined") {
				if (isExceed === false) isExceed = pkg.quota.concurrentBuilds > -1 && input.concurrentBuilds >= pkg.quota.concurrentBuilds;
				exceeds.push("concurrent_build");
			}

			if (typeof input.containerSize !== "undefined") {
				if (isExceed === false) isExceed = pkg.quota.containerSize > -1 && input.containerSize >= pkg.quota.containerSize;
				if (pkg.type === "hobby") isExceed = pkg.quota.containerSize === 0;
				exceeds.push("container_size");
			}

			const limits = pkg.quota;

			return respondSuccess({ data: { type: pkg.type, isExceed, exceeds, limits } });
		}),
});

export default subscriptionRouter;
