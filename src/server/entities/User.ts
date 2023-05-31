import { Schema } from "mongoose";

import type { HiddenBodyKeys } from "@/interfaces";

import type { IBase } from "./Base";
import { baseSchemaDefinitions } from "./Base";

export interface ProviderInfo {
	name: string;
	user_id?: string;
	access_token?: string;
}

export interface AccessTokenInfo {
	access_token: string;
	expiredTimestamp: number;
	expiredDate: Date;
	expiredDateGTM7: string;
}

export type UserCreateDto = Omit<IUser, keyof HiddenBodyKeys>;
export type UserUpdateDto = Partial<UserCreateDto>;

// export type IUser = typeof User;

export interface IUser extends IBase {
	name: string;
	/**
	 * Unique username of a user
	 * This equavilent with "slug"
	 */
	username: string | null;
	/**
	 * User email address
	 */
	email: string;
	/**
	 * Is this user's email or phone verified?
	 */
	verified?: boolean;
	/**
	 * User profile picture URL
	 */
	image?: string;
	/**
	 * List of Cloud Providers which this user can access to
	 */
	providers?: ProviderInfo[];
	/**
	 * User password (hashed)
	 */
	password?: string;
	/**
	 * User token
	 */
	token?: AccessTokenInfo;
}

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
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		collection: "users",
		timestamps: true,
	}
);
