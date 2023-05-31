import { Schema } from "mongoose";
import type { TypeOf } from "zod";
import { z } from "zod";

import { zUser } from "./User";

export const zOwner = z.object({
	owner: zUser.optional(),
	ownerId: z.string().optional(),
});

export type IOwner = TypeOf<typeof zOwner>;

export const ownershipSchemaDefinitions = {
	ownerId: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
};
