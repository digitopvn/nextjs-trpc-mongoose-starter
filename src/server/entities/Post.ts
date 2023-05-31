import { Schema } from "mongoose";

import type { HiddenBodyKeys } from "@/interfaces";

import type { IBase } from "./Base";
import { baseSchemaDefinitions } from "./Base";

export interface IPost extends IBase {
	name: string;
	title: string;
	content: string;
}

export type PostCreateDto = Omit<IPost, keyof HiddenBodyKeys>;
export type PostUpdateDto = Partial<PostCreateDto>;

export const postSchema = new Schema<IPost>(
	{
		...baseSchemaDefinitions,
		name: { type: String, maxlength: 250 },
		title: String,
		content: String,
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		collection: "posts",
		timestamps: true,
	}
);
