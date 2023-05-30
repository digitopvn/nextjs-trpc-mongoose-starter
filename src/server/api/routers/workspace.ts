import { makeSlug } from "diginext-utils/dist/Slug";
import { z } from "zod";

import { respondFailure, respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const workspaceRouter = createTRPCRouter({
	create: protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/workspaces",
				tags: ["Workspace"],
				summary: "Create new workspace",
				protect: true,
			},
		})
		.input(
			z.object({
				name: z.string(),
				key: z.string().optional(),
				type: z.enum(["default", "hobby"]).default("default"),
				userId: z.string().optional(),
				subscriptionId: z.string().optional(),
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

			if (!ctx.session.user.subscription && !input.key && !input.subscriptionId) return respondFailure(`DX Key is required.`);

			const subscription =
				ctx.session.user.subscription ||
				(input.key
					? await ctx.prisma.subscription.findFirst({ where: { key: input.key } })
					: await ctx.prisma.subscription.findFirst({ where: { id: input.subscriptionId } }));

			if (!subscription) return respondFailure(`Invalid DX key: subscription not found.`);

			// validate workspace type
			if (input.type === "hobby" && subscription.packageType !== input.type) {
				return respondFailure(
					`Invalid DX key: this server only supports "${input.type}" workspace, while this key is "${subscription.packageType}".`
				);
			}

			const slug = makeSlug(input.name);

			const data = await ctx.prisma.workspace.create({
				data: {
					...input,
					slug,
					subscriptionId: subscription.id,
					userId,
				},
			});
			return respondSuccess({ data });
		}),
	list: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/workspaces",
				tags: ["Workspace"],
				summary: "List of workspaces",
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
			const data = await ctx.prisma.workspace.findMany();
			return respondSuccess({ data });
		}),
	rxList: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session?.user.id;
		const data = await ctx.prisma.workspace.findMany({ where: { userId }, include: { subscription: true } });
		return data;
	}),
	getById: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/workspaces/{id}",
				tags: ["Workspace"],
				summary: "Get workspace by ID",
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
			const data = await ctx.prisma.workspace.findFirst({
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
				path: "/workspaces/{id}",
				tags: ["Workspace"],
				summary: "Update workspace by ID",
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
			const data = await ctx.prisma.workspace.update({
				where: { id },
				data: updateData,
			});
			return respondSuccess({ data });
		}),
	deleteById: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: "/workspaces/{id}",
				tags: ["Workspace"],
				summary: "Delete workspace by ID",
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
			const data = await ctx.prisma.workspace.delete({ where: { id } });
			return respondSuccess({ data });
		}),
});

export default workspaceRouter;
