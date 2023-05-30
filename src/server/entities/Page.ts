import { Schema } from "mongoose";

import type { IBaseModel } from "./Base";
import { baseModeleSchemaDefinitions } from "./Base";

// export type IUser = typeof User;

export interface IPage extends IBaseModel {
	code: string;
	name: Object;
	content: Object;
}

export const PageSchema = new Schema<IPage>(
	{
		...baseModeleSchemaDefinitions,
		code: {
			type: String,
			maxlength: 250,
		},
		name: {
			type: String,
		},
	},
	{
		collection: "pages",
		timestamps: true,
	}
);
