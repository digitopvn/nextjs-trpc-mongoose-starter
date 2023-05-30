import axios from "axios";
import { isJSON } from "class-validator";

import { paramsToObject } from "@/plugins/params";
import type { ApiRequestOptions } from "@/utils/types";

export const githubApi = async (options: ApiRequestOptions) => {
	const { url, method = "GET", headers: inputHeaders = {}, data = {}, access_token } = options;

	// headers
	const headers = { Accept: "application/vnd.github+json", ...inputHeaders } as any;
	if (access_token) headers.Authorization = `Bearer ${access_token}`;

	// make a request
	const res = await axios.post(url, data, { method, headers });

	// response data
	if (isJSON(res.data)) return JSON.parse(res.data);
	if (res.data.toString().indexOf("&") > -1) return paramsToObject(new URLSearchParams(res.data));
	return res.data;
};
