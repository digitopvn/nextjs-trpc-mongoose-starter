/* eslint-disable prefer-destructuring */

import { respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ApiResponseSchema } from "@/server/helpers/schemas";
import { sendEmail, SendEmailSchema } from "@/server/modules/email";

export const emailRouter = createTRPCRouter({
	send: publicProcedure
		// TODO: change to protected procedure
		// protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/email/send",
				tags: ["Email"],
				summary: "Send an email.",
			},
		})
		.input(SendEmailSchema)
		.output(ApiResponseSchema)
		.mutation(async ({ input }) => {
			// console.log("input :>> ", input);
			// return res;
			const sendResults = await sendEmail(input);
			return respondSuccess({
				data: {
					succeed: sendResults.filter((res) => res.status === 1).length,
					failure: sendResults.filter((res) => res.status === 0).length,
				},
			});
		}),

	// getAll: publicProcedure.query(({ ctx }) => {
	// 	return ctx.prisma.example.findMany();
	// }),

	// getSecretMessage: protectedProcedure.query(() => {
	// 	return "you can now see this secret message!";
	// }),
});
