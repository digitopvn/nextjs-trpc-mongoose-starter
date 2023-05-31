import type { TypeOf } from "zod";
import { z } from "zod";

export const zBase = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string().optional(),
	active: z.boolean().optional(),
	metadata: z.any().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	deletedAt: z.date().optional(),
});

export type IBase = TypeOf<typeof zBase>;

export const baseSchemaDefinitions = {
	slug: { type: String },
	active: { type: Boolean, default: true },
	metadata: { type: Object },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
};
export interface IBaseModel {
	_id: string;
	active: boolean;
	metaTitle?: Object;
	metaImage?: Object;
	metaDescription?: Object;
	metaKeyword?: Object;
	createdAt?: Date;
	deletedAt?: Date;
	updatedAt?: Date;
}

export const baseModeleSchemaDefinitions = {
	active: { type: Boolean, default: true },
	metaTitle: { type: Object },
	metaImage: { type: Object },
	metaDescription: { type: Object },
	metaKeyword: { type: Object },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	deletedAt: { type: Date },
};
