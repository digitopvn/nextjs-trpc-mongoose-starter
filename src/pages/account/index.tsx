import { Descriptions } from "antd";
import dayjs from "dayjs";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import AuthWrapper from "@/commons/AuthWrapper";
import ContentContainer from "@/commons/ContentContainer";
import { PageTitle } from "@/commons/PageTitle";
import { Main } from "@/templates/Main";
import { Meta } from "@/templates/Meta";

const LocalizedFormat = require("dayjs/plugin/localizedFormat");

dayjs.extend(LocalizedFormat);

const Dashboard: NextPage = () => {
	const { data: sessionData } = useSession();

	return (
		<AuthWrapper>
			<Main meta={<Meta title="Your Account" description="Your account information." />}>
				<PageTitle title="Your Account" actions={[]} />

				<br />

				<ContentContainer>
					<Descriptions bordered column={1} className="max-w-3xl">
						<Descriptions.Item label="Full Name">{sessionData?.user.name}</Descriptions.Item>
						<Descriptions.Item label="Username">{sessionData?.user.username}</Descriptions.Item>
						<Descriptions.Item label="Email">{sessionData?.user.email}</Descriptions.Item>
						<Descriptions.Item label="Joined date">
							{sessionData?.user.createdAt && dayjs(sessionData?.user.createdAt).format("L LT")}
						</Descriptions.Item>
					</Descriptions>
				</ContentContainer>
			</Main>
		</AuthWrapper>
	);
};

export default Dashboard;
