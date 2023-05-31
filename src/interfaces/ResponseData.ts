import { isArray, isString } from "lodash";
import { z } from "zod";

import type { IResponsePagination } from "./IQuery";

export const zResponse = (zData?: any) =>
	z.object({
		status: z.number(),
		messages: z.array(z.string()),
		data: zData || z.any(),
	});

export interface ResponseData<T = any> extends IResponsePagination {
	/**
	 * 1 = succeed | 0 = failed
	 */
	status: 1 | 0;
	data: T;
	/**
	 * Error/warning messages
	 */
	messages: string[];
}

export const respondFailure = <T = any>(params: { data?: T; msg?: string } | string | string[]) => {
	if (isString(params)) return { status: 0, messages: [params] } as ResponseData<typeof data>;
	if (isArray(params)) return { status: 0, messages: params } as ResponseData<typeof data>;
	const { msg = "Unexpected error.", data } = params;
	return { status: 0, data, messages: [msg] } as ResponseData<typeof data>;
};

export const respondSuccess = <T = any>(params: { data?: T; msg?: string | string[] } & IResponsePagination) => {
	const { msg = "Ok.", data, ...pagination } = params;

	return { status: 1, data, messages: isArray(msg) ? msg : [msg], ...pagination } as ResponseData<T> & IResponsePagination;
};
