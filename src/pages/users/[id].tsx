import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "../../utils/api";

const UserPage: NextPage = () => {
	const { query } = useRouter();
	const userId = query.id as string;
	const userQuery = api.users.getById.useQuery(userId, {
		enabled: typeof userId !== "undefined",
	});

	return (
		<div>
			<h1>{userQuery.data?.name}</h1>
		</div>
	);
};

export default UserPage;
