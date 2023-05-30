export const requestMethodList = ["GET", "POST", "PATCH", "DELETE"] as const;
// eslint-disable-next-line prettier/prettier
export type RequestMethodType = (typeof requestMethodList)[number];

export const routePermissionList = ["full", "own", "read", "create", "update", "delete"] as const;
export type RoutePermisionType = (typeof routePermissionList)[number];

export interface ApiOptions {
	method?: RequestMethodType;
	data?: any;
	headers?: any;
	access_token?: string;
}

export interface ApiResponse<T = any> {
	status: number;
	data: T;
	messages: string[];
}

export interface ApiRequestOptions extends ApiOptions {
	url: string;
}

export type GithubAccessTokenInfo = {
	access_token?: string;
	expires_in?: number;
	refresh_token?: string;
	refresh_token_expires_in?: number;
	token_type?: string;
	error?: string;
	error_description?: string;
	error_uri?: string;
};

export type GithubProfile = {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	site_admin: boolean;
	name: string;
	company: string;
	blog: string;
	location: string;
	email: string;
	hireable: boolean;
	bio: string;
	twitter_username: string;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
};
