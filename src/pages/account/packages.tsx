import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import ContentContainer from "@/commons/ContentContainer";
import { PageTitle } from "@/commons/PageTitle";
import PackageContainer from "@/components/PackageContainer";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const Dashboard: NextPage = () => {
	return (
		<AuthWrapper>
			<Main meta={<Meta title="Packages" description="Subscribe to one of these packages." />}>
				<PageTitle title="Packages" desc="Subscribe to one of these packages." actions={[]} />

				<ContentContainer>
					<PackageContainer />
				</ContentContainer>
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
