import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, List } from "antd";
import { type NextPage } from "next";

import AuthWrapper from "@/commons/AuthWrapper";
import ContentContainer from "@/commons/ContentContainer";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";
import { api } from "@/utils/api";

const KeyListPage: NextPage = () => {
	const subscriptionQuery = api.subscriptions.rxList.useQuery();
	const { data: subscriptions = [] } = subscriptionQuery;

	return (
		<AuthWrapper>
			<Main meta={<Meta title="Diginext keys" description="List of your Diginext API keys" />}>
				<PageTitle
					title="Diginext keys"
					actions={[
						<Button key="create-new-key" href="/account/packages" icon={<PlusOutlined />}>
							Create
						</Button>,
					]}
				/>
				<ContentContainer>
					<List
						bordered
						dataSource={subscriptions}
						renderItem={(item) => (
							<List.Item actions={[<Button key="key-delete-btn" type="ghost" icon={<DeleteOutlined />} />]}>
								<List.Item.Meta title={item.name} description={<pre>{item.key}</pre>} />
							</List.Item>
						)}
					/>
				</ContentContainer>
			</Main>
		</AuthWrapper>
	);
};

export default KeyListPage;
