import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type QueryObject = {
	[x: string]: string;
};

export const useRouterQuery = (): [
	QueryObject,
	{
		setQuery: (query?: QueryObject) => QueryObject;
		deleteQuery: (keys: string[]) => any;
		deleteAllQueryKeys: () => any;
	}
] => {
	const router = useRouter();

	const routerPathQuery = router.asPath;
	const searchParams = routerPathQuery.indexOf("?") > -1 ? router.asPath.split("?")[1] : undefined;
	const urlParams = searchParams ? new URLSearchParams(searchParams) : undefined;
	const params: QueryObject = urlParams ? Object.fromEntries(urlParams) : {};

	const [routerQuery, setRouterQuery] = useState(params);

	const setQuery = (query: QueryObject = {}) => {
		const newQuery = { ...routerQuery, ...query } as QueryObject;
		setRouterQuery(newQuery);

		router.push(`${router.pathname}`, { query: newQuery });

		return newQuery;
	};

	const deleteQuery = (keys: string[]) => {
		const newQuery = { ...routerQuery } as QueryObject;
		keys.forEach((key) => {
			delete newQuery[key];
		});
		setRouterQuery(newQuery);

		router.push(router.pathname, { query: newQuery });

		return routerQuery;
	};

	const deleteAllQueryKeys = () => {
		const keys = Object.keys(routerQuery);
		return deleteQuery(keys);
	};

	useEffect(() => {
		if (!router.isReady) return;

		if (routerPathQuery.indexOf("?") === -1) {
			deleteAllQueryKeys();
			return;
		}

		/**
		 * ! [Goon's note]
		 * Can't get "page" directly from "router.query" because of Next.js hydration & Automatic Static Optimization
		 * Learn more: https://nextjs.org/docs/advanced-features/automatic-static-optimization
		 * Below is the alternative solution! MAGIC!!!
		 */
		setRouterQuery(params);
	}, [router.asPath, router.isReady]);

	return [routerQuery, { setQuery, deleteQuery, deleteAllQueryKeys }];
};
