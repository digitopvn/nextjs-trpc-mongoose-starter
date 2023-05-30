import { z } from "zod";

import { env } from "@/env.mjs";
import { respondFailure, respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { githubApi } from "@/utils/github-api";
import type { GithubAccessTokenInfo } from "@/utils/types";

const generateAccessToken = async (code: string) => {
	const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = env;

	const url = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`;
	const tokenInfo = (await githubApi({ url })) as GithubAccessTokenInfo;

	if (tokenInfo.error) return respondFailure({ msg: `[GITHUB_${tokenInfo.error.toUpperCase()}] ${tokenInfo.error_description}` });

	return respondSuccess({ data: tokenInfo });
};

export const githubRouter = createTRPCRouter({
	generateAccessToken: publicProcedure
		// .meta({
		// 	openapi: {
		// 		method: "POST",
		// 		path: "/domains/create",
		// 		tags: ["domains"],
		// 		summary: "Create a new sub-domain of diginext.site",
		// 	},
		// })
		.input(
			z.object({
				code: z.string(),
			})
		)
		.output(
			z.object({
				status: z.number(),
				data: z
					.object({
						access_token: z.string().optional(),
						expires_in: z.number().optional(),
						refresh_token: z.string().optional(),
						refresh_token_expires_in: z.number().optional(),
						token_type: z.string().optional(),
						error: z.string().optional(),
						error_description: z.string().optional(),
						error_uri: z.string().optional(),
					})
					.optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const res = await generateAccessToken(input.code);
			return res;
		}),
});
