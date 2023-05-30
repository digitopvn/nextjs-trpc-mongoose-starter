import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Dashboard: NextPage = () => {
	return (
		<AuthWrapper>
			<Main meta={<Meta title="Workspaces" description="List of your workspaces." />}>
				<PageTitle title="Workspaces" actions={[]} />
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
