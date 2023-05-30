import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";

const Dashboard: NextPage = () => {
	return (
		<AuthWrapper>
			<Main>
				<PageTitle title="Dashboard" actions={[]} />
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
