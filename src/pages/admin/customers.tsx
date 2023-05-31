import { Admin } from "@/templates/Admin";
import { api } from "@/utils/api";

const Customers = (props: any): JSX.Element => {
	const data = api.pages.getAll.useQuery();
	return (
		<Admin>
			<h1> Hello Customers</h1>
		</Admin>
	);
};

export default Customers;
