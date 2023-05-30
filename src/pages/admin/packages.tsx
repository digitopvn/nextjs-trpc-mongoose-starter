import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Dashboard: NextPage = () => {
	return (
		<AuthWrapper>
			<Main meta={<Meta title="Packages" description="Subscribe to one of our packages." />}>
				<PageTitle title="Packages" actions={[]} />
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
