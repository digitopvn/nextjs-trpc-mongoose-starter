import { Schema } from "mongoose";

import type { IBaseModel } from "./Base";
import { baseModeleSchemaDefinitions } from "./Base";

export interface ICustomer extends IBaseModel {
	name: string;
	token: string;
	nameNon: string;
	email: string;
	phone: string;
	password: string;
}

export const CustomerSchema = new Schema<ICustomer>(
	{
		...baseModeleSchemaDefinitions,
		name: {
			type: String,
			maxlength: 250,
		},
		nameNon: {
			type: String,
			maxlength: 250,
		},
		token: {
			typee: String,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
			maxlength: 11,
		},
		password: {
			type: String,
			maxlength: 250,
			minlength: 8,
		},
	},
	{
		collection: "customers",
		timestamps: true,
	}
);
