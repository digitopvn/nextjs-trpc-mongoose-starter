import { type NextPage } from "next";

import { api } from "../../utils/api";

const UserListPage: NextPage = () => {
	const userQuery = api.users.list.useQuery();
	const { data = { data: [] } } = userQuery;
	const { data: users = [] } = data;

	return (
		<div>
			{users.map((user) => (
				<h3 key={user.id}>
					[{user.id}] {user.name}
				</h3>
			))}
		</div>
	);
};

export default UserListPage;
