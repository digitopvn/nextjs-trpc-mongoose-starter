import { Schema } from "mongoose";
import type { TypeOf } from "zod";
import { z } from "zod";

import { MaskedFields, zQueryOptions } from "@/interfaces";

import { baseSchemaDefinitions, zBase } from "./Base";

// export type IUser = typeof User;

export const zProviderInfo = z.object({ name: z.string(), user_id: z.string().optional(), access_token: z.string().optional() });
export const zAccessTokenInfo = z.object({
	access_token: z.string(),
	expiredTimestamp: z.number(),
	expiredDate: z.date(),
	expiredDateGTM7: z.string(),
});
export const zUser = zBase.extend({
	name: z.string(),
	username: z.string(),
	email: z.string(),
	verified: z.boolean().optional(),
	image: z.string().optional(),
	providers: z.array(zProviderInfo),
	password: z.string().optional(),
	token: zAccessTokenInfo,
});

export const zUserQuery = zUser
	.partial()
	.omit({ ...MaskedFields, providers: true, token: true, password: true })
	.merge(zQueryOptions)
	.default({});
export const zUserUpdate = zUser.partial().omit({ id: true, _id: true });
export const zUserCreate = zUser.omit(MaskedFields);

export type ProviderInfo = TypeOf<typeof zProviderInfo>;
export type AccessTokenInfo = TypeOf<typeof zAccessTokenInfo>;
export type IUser = TypeOf<typeof zUser>;
export type UserCreateDto = TypeOf<typeof zUserCreate>;
export type UserUpdateDto = Partial<UserCreateDto>;

export const userSchema = new Schema<IUser>(
	{
		...baseSchemaDefinitions,
		name: {
			type: String,
			maxlength: 250,
		},
		username: {
			type: String,
		},
		email: {
			type: String,
			maxlength: 500,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		image: {
			type: String,
		},
		providers: {
			type: [Object],
			default: [],
		},
		password: {
			type: String,
		},
		token: {
			type: Object,
		},
	},
	{
		collection: "users",
		timestamps: true,
	}
);
