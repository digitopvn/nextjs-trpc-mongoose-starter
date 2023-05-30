import { Schema } from "mongoose";

import type { IUser } from "./User";

export interface IBase {
	_id: string;
	/**
	 * Slug of an item, generated automatically by its "name"
	 */
	slug?: string;
	active?: boolean;
	metadata?: any;
	/**
	 * Owner ID of the app
	 *
	 * @remarks This can be populated to {IUser} data
	 */
	owner?: IUser;
	ownerId?: string;
	createdAt?: Date;
	deletedAt?: Date;
	updatedAt?: Date;
}

export const baseSchemaDefinitions = {
	slug: { type: String },
	active: { type: Boolean, default: true },
	metadata: { type: Object },
	owner: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
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
