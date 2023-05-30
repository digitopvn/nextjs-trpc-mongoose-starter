import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Dashboard: NextPage = () => {
	return (
		<AuthWrapper>
			<Main meta={<Meta title="Your Keys" description="List of your Diginext KEYS" />}>
				<PageTitle title="Your Keys" actions={[]} />
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
