import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import axios from "axios";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";

import type { ApiOptions, ApiResponse } from "./types";

export const useApi = <T>(keys: any[], apiPath: string, options: ApiOptions = {}) => {
	const [noti] = notification.useNotification();
	const router = useRouter();
	const { access_token } = options;
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";
	// console.log(apiPath, "> headers :>> ", headers);

	return useQuery({
		queryKey: keys,
		queryFn: async () => {
			const { data } = await axios.get<ApiResponse<T>>(`${router.basePath}${apiPath}`, { ...options, headers });
			if (!data.status && !isEmpty(data.messages)) {
				data.messages.forEach((message) => {
					if (message) noti.error({ message: "Failed.", description: message });
				});
			}
			return data;
		},
	});
};

export type UseCreateApi<I, T> = [(data: I) => Promise<ApiResponse<T>> | undefined, "error" | "idle" | "loading" | "success"];

export const usePostApi = <I, T>(keys: any[], apiPath: string, options: ApiOptions = {}): UseCreateApi<I, T> => {
	const [noti] = notification.useNotification();
	const router = useRouter();
	const queryClient = useQueryClient();

	const { access_token } = options;
	const headers: any = access_token ? { Authorization: `Bearer ${access_token}` } : {};
	headers["Cache-Control"] = "no-cache";

	const mutation = useMutation<ApiResponse<T>, Error, I>({
		mutationFn: async (body) => {
			const apiURL = `${router.basePath}${apiPath}`;
			const { data } = await axios.post<ApiResponse<T>>(apiURL, body, { headers });

			if (!data.status) {
				if (!isEmpty(data.messages)) {
					data.messages.forEach((message) => {
						if (message) noti.error({ message: "Failed.", description: message });
					});
				} else {
					noti.error({ message: "Something is wrong..." });
				}
			}

			return data;
		},

		onMutate: async (newData) => {
			await queryClient.cancelQueries({ queryKey: keys });
			return newData;
		},

		onSuccess: (newItem, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [keys[0], "list"] });
			queryClient.invalidateQueries({ queryKey: [keys[0], (newItem as any)?.slug] });
		},
	});

	const { mutateAsync, status } = mutation;
	return [mutateAsync, status];
};
