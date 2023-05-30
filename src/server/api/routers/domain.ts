/* eslint-disable prefer-destructuring */
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { isEmpty } from "lodash";
import { z } from "zod";

import { env } from "@/env.mjs";
import { respondFailure, respondSuccess } from "@/plugins/response-utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

const DIGITAL_OCEAN_API_BASE_URL = `https://api.digitalocean.com/v2`;
const DIGINEXT_DOMAIN = `diginext.site`;

export interface DomainRecord {
	id?: string | number;
	/**
	 * The priority for SRV and MX records.
	 */
	priority?: number;
	/**
	 * The port for SRV records.
	 */
	port?: number;
	/**
	 * This value is the time to live for the record, in seconds. This defines the time frame that clients can cache queried information before a refresh should be requested.
	 */
	ttl?: number;
	/**
	 * The weight for SRV records.
	 */
	weight?: string;
	/**
	 * An unsigned integer between 0-255 used for CAA records.
	 */
	flags?: number;
	/**
	 * The parameter tag for CAA records. Valid values are "issue", "issuewild", or "iodef"
	 */
	tag?: string | number;

	/**
	 * The host name, alias, or service being defined by the record.
	 * - This could be the subdomain name: `sub-domain-name.diginext.site`
	 * @example "@"
	 */
	name: string;

	/**
	 * The type of the DNS record. For example: `A`, `CNAME`, `TXT`, ...
	 * @default "A"
	 */
	type?: "A" | "AAAA" | "CAA" | "CNAME" | "MX" | "NS" | "SOA" | "SRV" | "TXT";

	/**
	 * Variable data depending on record type.
	 * - For example, the "data" value for an A record would be the IPv4 address to which the domain will be mapped.
	 * - For a CAA record, it would contain the domain name of the CA being granted permission to issue certificates.
	 */
	data: string;
}

export async function doApi(options: AxiosRequestConfig & { access_token?: string }) {
	const { access_token, method = "GET" } = options;

	options.baseURL = DIGITAL_OCEAN_API_BASE_URL;

	if (isEmpty(options.headers)) options.headers = {};
	if (isEmpty(access_token)) {
		throw new Error(`Digital Ocean API access token is required.`);
	}

	options.headers.Authorization = `Bearer ${access_token}`;

	if (["POST", "PATCH", "DELETE"].includes(method?.toUpperCase())) {
		if (isEmpty(options.headers["content-type"])) options.headers["content-type"] = "application/json";
	}

	// if (options.data) options.data = new URLSearchParams(options.data);
	// log(`doApi: ${options.url} > options.headers :>>`, options.headers);

	try {
		const { data: responseData } = await axios(options);
		// log(`doApi > responseData :>>`, responseData);
		return responseData;
	} catch (e: any) {
		return { status: 0, messages: [`Something went wrong: ${e.toString()}`] };
	}
}

type CreateRecordInDomainResponse = {
	status: number;
	data: { domain?: string; domain_record?: string };
	messages: string[];
};

export const createRecordInDomain = async (input: DomainRecord) => {
	const { name, data, type = "A" } = input;

	const domain = `${name}.${DIGINEXT_DOMAIN}`;
	let record: DomainRecord;

	try {
		const access_token = env.DO_API_ACCESS_TOKEN;

		// log(`doProvider :>>`, doProvider);
		// log(`createRecordInDomain > apiAccessToken :>>`, access_token);

		// check if this record existed
		const { domain_records } = await doApi({
			url: `/domains/${DIGINEXT_DOMAIN}/records?name=${domain}`,
			access_token,
		});

		const successMsg = `Created the domain "${domain}" successfully.`;

		if (domain_records && domain_records.length > 0) {
			record = domain_records[0];

			// if it's existed -> check if the "data" is the same -> return success:
			if (record.data === data) {
				return { status: 1, data: { domain, domain_record: domain_records[0] }, messages: [successMsg] } as CreateRecordInDomainResponse;
			}

			return { status: 0, data: { domain }, messages: [`This domain name is existed, please choose another one.`] } as CreateRecordInDomainResponse;
		}

		// if the record is not existed -> create new record:
		const apiRes = await doApi({
			method: "POST",
			url: `/domains/${DIGINEXT_DOMAIN}/records`,
			data: JSON.stringify({ name, data, type }),
			access_token,
		});
		const { domain_record } = apiRes;
		// console.log("apiRes :>> ", apiRes);

		return { status: 1, data: { domain, domain_record }, messages: [successMsg] } as CreateRecordInDomainResponse;
	} catch (e: any) {
		// throw new Error(e);
		return { status: 0, data: { domain }, messages: [`Something wrong: ${e.message}`] } as CreateRecordInDomainResponse;
	}
};

export const domainRouter = createTRPCRouter({
	create: publicProcedure
		// TODO: change to protected procedure
		// protectedProcedure
		.meta({
			openapi: {
				method: "POST",
				path: "/domains/create",
				tags: ["Domain"],
				summary: "Create a new sub-domain of diginext.site",
			},
		})
		.input(
			z.object({
				name: z.string(),
				data: z.string(),
				type: z.enum(["A", "AAAA", "CAA", "CNAME", "MX", "NS", "SOA", "SRV", "TXT"]).default("A"),
			})
		)
		.output(
			z.object({
				status: z.number(),
				data: z.object({ domain: z.string().optional(), domain_record: z.any().optional() }).optional(),
				messages: z.array(z.string()).optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session?.user.id;

			const res = await createRecordInDomain(input);
			console.log("res :>> ", res);

			if (res.status) {
				const domain = await ctx.prisma.domain.create({
					data: {
						...input,
						userId,
					},
				});
				if (!domain) return respondFailure(`Unabled to insert new domain.`);
			}

			return res;
		}),
	list: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/domains",
				tags: ["Domain"],
				summary: "List of domains",
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
			const data = await ctx.prisma.domain.findMany();
			return respondSuccess({ data });
		}),
	getById: protectedProcedure
		.meta({
			openapi: {
				method: "GET",
				path: "/domains/{id}",
				tags: ["Domain"],
				summary: "Get domain by ID",
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
			const data = await ctx.prisma.domain.findFirst({
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
				path: "/domains/{id}",
				tags: ["Domain"],
				summary: "Update domain by ID",
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
			const data = await ctx.prisma.domain.update({
				where: { id },
				data: updateData,
			});
			return respondSuccess({ data });
		}),
	deleteById: protectedProcedure
		.meta({
			openapi: {
				method: "DELETE",
				path: "/domains/{id}",
				tags: ["Domain"],
				summary: "Delete domain by ID",
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
			const data = await ctx.prisma.domain.delete({ where: { id } });
			return respondSuccess({ data });
		}),
});
