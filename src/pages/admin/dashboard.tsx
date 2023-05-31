import { Admin } from "@/templates/Admin";
import { api } from "@/utils/api";

const Dashboard = (props: any): JSX.Element => {
	const data = api.pages.getAll.useQuery();
	return (
		<Admin>
			<h1> Hello Dashboard</h1>
		</Admin>
	);
};

export default Dashboard;
