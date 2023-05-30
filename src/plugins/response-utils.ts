import { isArray, isString } from "lodash";

export interface ResponseData<T = any> {
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
	if (isString(params)) return { status: 0, messages: [params] } as ResponseData<T>;
	if (isArray(params)) return { status: 0, messages: params } as ResponseData<T>;

	const { msg = "Unexpected error.", data } = params;
	return { status: 0, data, messages: [msg] } as ResponseData<T>;
};

export const respondSuccess = <T = any>(params: { data?: T; msg?: string | string[] }) => {
	const { msg = "Ok.", data } = params;

	if (isArray(msg)) return { status: 1, data, messages: msg } as ResponseData<T>;

	return { status: 1, data, messages: [msg] } as ResponseData<T>;
};
