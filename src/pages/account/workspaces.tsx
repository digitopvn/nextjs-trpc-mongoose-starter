import { List, Typography } from "antd";
import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import ContentContainer from "@/commons/ContentContainer";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { api } from "@/utils/api";

const Dashboard: NextPage = () => {
	const workspaceQuery = api.workspaces.rxList.useQuery();
	const { data: workspaces = [] } = workspaceQuery;

	return (
		<AuthWrapper>
			<Main meta={<Meta title="Workspaces" description="List of your workspaces." />}>
				<PageTitle title="Workspaces" actions={[]} />

				<ContentContainer>
					<List
						bordered
						dataSource={workspaces}
						renderItem={(item) => (
							<List.Item>
								<List.Item.Meta
									title={
										<Typography.Title level={4}>
											{item.name} <Typography.Text>({item.subscription.packageType})</Typography.Text>
										</Typography.Title>
									}
									description={
										<>
											<Typography.Text>KEY</Typography.Text>: {item.subscription.key}
										</>
									}
								/>
							</List.Item>
						)}
					/>
				</ContentContainer>
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
