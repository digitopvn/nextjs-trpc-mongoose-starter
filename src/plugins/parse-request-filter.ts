/* eslint-disable no-nested-ternary */
import { isBooleanString, isNumberString } from "class-validator";
import { cloneDeepWith, isBoolean, isDate, isEmpty, isNumber, isString, trim } from "lodash";

import type { IQueryFilter, IQueryOptions, IQueryPagination } from "@/interfaces";

import { isValidObjectId, MongoDB } from "./mongodb";

export const parseRequestFilter = (requestQuery: any) => {
	const {
		download = false,
		skip,
		limit = 0,
		page = 1,
		size = 0,
		populate,
		select,
		status,
		sort, // @example: -updatedAt,-createdAt
		order, // @example: -updatedAt,-createdAt
		search = false,
		raw = false,
		where = {},
		access_token,
		...filter
	} = requestQuery;

	// filter
	const _filter: { [key: string]: any } = { ...filter };

	if (_filter.id) {
		_filter._id = _filter.id;
		delete _filter.id;
	}

	// parse "search"
	if (search === true || search === "true" || search === 1 || search === "1") {
		Object.entries(_filter).forEach(([key, val]) => {
			_filter[key] =
				isString(val) && !isValidObjectId(val) && !isBoolean(val) && !isDate(val) && !isNumber(val) && !isBooleanString(val) && !isNumberString(val)
					? { $regex: trim(val), $options: "i" }
					: val;
		});
	}

	// parse "populate" & "select"
	const _populate = populate ? trim(populate.toString(), ",") : "";
	const _select = select ? trim(select.toString(), ",") : "";
	const options: IQueryOptions & IQueryPagination = {
		download,
		populate: _populate === "" ? [] : _populate.indexOf(",") > -1 ? _populate.split(",") : [_populate],
		select: _select === "" ? [] : _select.indexOf(",") > -1 ? _select.split(",") : [_select],
	};

	// parse "sort" (or "order") from the query url:
	let _sortOptions: string[] | undefined;
	if (sort) _sortOptions = sort.indexOf(",") > -1 ? sort.split(",") : [sort];
	if (order) _sortOptions = order.indexOf(",") > -1 ? order.split(",") : [order];
	const sortOptions: { [key: string]: 1 | -1 } = {};
	if (_sortOptions)
		_sortOptions.forEach((s) => {
			const isDesc = s.charAt(0) === "-";
			const key = isDesc ? s.substring(1) : s;
			const sortValue: 1 | -1 = isDesc ? -1 : 1;
			sortOptions[key] = sortValue;
		});
	if (!isEmpty(sortOptions)) options.order = sortOptions;
	if (raw === "true" || raw === true) options.raw = true;

	// parse "pagination"
	// if (this.pagination && this.pagination.page_size) {
	// 	options.skip = ((this.pagination.current_page ?? 1) - 1) * this.pagination.page_size;
	// 	options.limit = this.pagination.page_size;
	// }

	// manipulate "$or" & "$and" filter:
	if (_filter.or) {
		_filter.$or = _filter.or;
		delete _filter.or;
	}
	if (_filter.and) {
		_filter.$and = _filter.and;
		delete _filter.and;
	}

	// console.log("[2] _filter :>> ", _filter);

	/**
	 * Traverse filter object and transform the values.
	 * Need to cast valid {ObjectId} string to {ObjectId} since Mongoose "aggregate" doesn't cast them automatically.
	 * @link https://mongoosejs.com/docs/api/aggregate.html#Aggregate()
	 */
	const finalFilter = cloneDeepWith(_filter, function clone(value) {
		return MongoDB.isValidObjectId(value) ? MongoDB.toObjectId(value) : undefined;
	}) as IQueryFilter;
	return { filter: finalFilter, options };
};
