import type { FilterQuery } from "mongoose";
import type { TypeOf } from "zod";
import { z } from "zod";

export const zQueryGeneral = z.record(z.string(), z.any());
export type IQueryGeneral = TypeOf<typeof zQueryGeneral>;

export interface IPaginationQueryParams {
	page?: number;
	size?: number;
	limit?: number;
	skip?: number;
}

export interface IPostQueryParams {
	/**
	 * Fields to populate, seperated by commas, for example: `owner,workspace`
	 */
	populate?: string;
	select?: string;
	/**
	 * @example "-updatedAt,-createdAt"
	 */
	order?: string;
	/**
	 * Disable the default `{$set: body}` of "update" query & update `{body}` directly to the items
	 * @default false
	 */
	raw?: boolean;
}

export interface IPatchQueryParams extends IPostQueryParams {
	/**
	 * Find one item by `{ObjectID}`
	 */
	id?: string;

	/**
	 * Find one item by slug
	 */
	slug?: string;
}

export interface IDeleteQueryParams {
	/**
	 * Delete one item by `{ObjectID}`
	 */
	id?: string;
	/**
	 * Delete one item by `{slug}`
	 */
	slug?: string;
}

export interface IGetQueryParams extends IPostQueryParams, IPaginationQueryParams {
	/**
	 * Find one item by `{ObjectID}`
	 */
	id?: string;
	/**
	 * Mark this request as search (return the similar results based on the filter query params)
	 * @default true
	 */
	search?: boolean;
	/**
	 * If `true`, return the excel binary file to download.
	 * @default false
	 */
	download?: boolean;
}

export interface IQueryPagination extends IQueryGeneral {
	limit?: number;
	page?: number;
	size?: number;
	skip?: number;
	total?: number;
	total_items?: number;
	total_pages?: number;
	current_page?: number;
	page_size?: number;
	next_page?: string;
	prev_page?: string;
}

export const zQueryOptions = z.object({
	id: z.string().optional(),
	populate: z
		.string()
		// eslint-disable-next-line no-nested-ternary
		.transform((_populate) => (_populate === "" ? [] : _populate.indexOf(",") > -1 ? _populate.split(",") : [_populate]))
		.optional(),
	select: z
		.string()
		// eslint-disable-next-line no-nested-ternary
		.transform((_select) => (_select === "" ? [] : _select.indexOf(",") > -1 ? _select.split(",") : [_select]))
		.optional(),
	order: z
		.string()
		.transform((_order) => {
			let _sortOptions: string[] | undefined;
			if (_order) _sortOptions = _order.indexOf(",") > -1 ? _order.split(",") : [_order];
			const sortOptions: { [key: string]: 1 | -1 } = {};
			if (_sortOptions)
				_sortOptions.forEach((s) => {
					const isDesc = s.charAt(0) === "-";
					const key = isDesc ? s.substring(1) : s;
					const sortValue: 1 | -1 = isDesc ? -1 : 1;
					sortOptions[key] = sortValue;
				});
			return sortOptions;
		})
		.optional(),
	search: z.enum(["true", "false"]).optional(),
	download: z.enum(["true", "false"]).optional(),
	raw: z
		.enum(["true", "false"])
		.transform((val) => val === "true")
		.optional(),
});

export type IQueryOptions = TypeOf<typeof zQueryOptions> & IQueryPagination;

export interface IQueryFilter extends FilterQuery<any> {
	[key: string]: any;
}

export interface IResponsePagination {
	total_items?: number;
	total_pages?: number;
	current_page?: number;
	page_size?: number;
	prev_url?: string;
	next_url?: string;
}

export const MaskedFields: { id: true; _id: true; metadata: true; createdAt: true; deletedAt: true; updatedAt: true } = {
	id: true,
	_id: true,
	metadata: true,
	createdAt: true,
	deletedAt: true,
	updatedAt: true,
};
