import { Schema } from "mongoose";
import type { TypeOf } from "zod";
import { z } from "zod";

import { MaskedFields, zQueryOptions } from "@/interfaces";

import { baseSchemaDefinitions, zBase } from "./Base";
import { ownershipSchemaDefinitions, zOwner } from "./IOwner";

export const zPost = z
	.object({
		title: z.string(),
		content: z.string(),
	})
	.merge(zBase)
	.merge(zOwner);

export const zPostQuery = zPost
	.partial()
	.omit({ ...MaskedFields, owner: true })
	.merge(zQueryOptions)
	.default({});
export const zPostUpdate = zPost.partial().omit({ id: true, _id: true });
export const zPostCreate = zPost.omit(MaskedFields);

export type IPost = TypeOf<typeof zPost>;
export type PostCreateDto = TypeOf<typeof zPostCreate>;
export type PostUpdateDto = TypeOf<typeof zPostUpdate>;

export const postSchema = new Schema<IPost>(
	{
		...baseSchemaDefinitions,
		...ownershipSchemaDefinitions,
		name: { type: String, maxlength: 250 },
		title: String,
		content: String,
	},
	{
		collection: "posts",
		timestamps: true,
	}
);
