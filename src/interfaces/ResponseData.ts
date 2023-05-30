import { isArray, isString } from "lodash";

import type { IResponsePagination } from "./IQuery";

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

export const respondFailure = (params: { data?: any; msg?: string } | string | string[]) => {
	if (isString(params)) return { status: 0, messages: [params] } as ResponseData<typeof data>;
	if (isArray(params)) return { status: 0, messages: params } as ResponseData<typeof data>;

	const { msg = "Unexpected error.", data } = params;
	return { status: 0, data, messages: [msg] } as ResponseData<typeof data>;
};

export const respondSuccess = (params: { data?: any; msg?: string | string[] } & IResponsePagination) => {
	const { msg = "Ok.", data, ...pagination } = params;

	return { status: 1, data, messages: isArray(msg) ? msg : [msg], ...pagination } as ResponseData<typeof data> & IResponsePagination;
};
