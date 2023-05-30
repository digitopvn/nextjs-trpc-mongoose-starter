import { Col, Modal, notification, Row, Tag } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React from "react";

import { api } from "@/utils/api";

import PackageCard from "./PackageCard";

const PackageContainer = () => {
	const { data: sessionData, status } = useSession();

	const pkgQuery = api.packages.rxList.useQuery();
	const { data: packages = [] } = pkgQuery;

	const pkgSubscribe = api.subscriptions.rxSubscribe.useMutation();

	const subscribe = async (id?: string, type?: "hobby" | "self_hosted" | "on_premise") => {
		if (!id) {
			notification.error({ message: `Package ID is required.` });
			return;
		}
		if (!type) {
			notification.error({ message: `Package type is required.` });
			return;
		}

		const subscription = await pkgSubscribe.mutateAsync({
			name: sessionData?.user.name || "",
			packageId: id,
			packageType: type,
			paid: 0,
			userId: sessionData?.user.id,
			expiredAt: dayjs().year(2100).toDate(),
		});

		Modal.success({
			title: "Congrats!",
			content: (
				<>
					Your DX key is: <pre>{subscription.key}</pre>
				</>
			),
		});
	};

	const hobbyPkg = packages.find((pkg) => pkg.type === "hobby");
	const selfHostedPkg = packages.find((pkg) => pkg.type === "self_hosted");
	const onPremisePkg = packages.find((pkg) => pkg.type === "on_premise");

	return (
		<Row gutter={16}>
			<Col span={8}>
				<PackageCard id={hobbyPkg?.id} type={hobbyPkg?.type} title="HOBBY" onSubscribe={() => subscribe(hobbyPkg?.id, hobbyPkg?.type)}>
					<ul className="list-disc px-8">
						<li>Running on our cloud</li>
						<li>1 concurrent build</li>
						<li>Up to 2 projects</li>
						<li>Up to 6 apps</li>
						<li>
							Up to <Tag>2x</Tag>app's container size
						</li>
					</ul>
				</PackageCard>
			</Col>
			<Col span={8}>
				<PackageCard
					id={selfHostedPkg?.id}
					type={selfHostedPkg?.type}
					highlight
					title="SELF HOSTED"
					onSubscribe={() => subscribe(selfHostedPkg?.id, selfHostedPkg?.type)}
				>
					<ul className="list-disc px-8">
						<li>Running on your infrastructure</li>
						<li>Unlimited concurrent builds</li>
						<li>Unlimited projects</li>
						<li>Unlimited apps</li>
						<li>
							Up to <Tag color="error">10x</Tag>app's container size
						</li>
					</ul>
				</PackageCard>
			</Col>
			<Col span={8}>
				<PackageCard
					id={onPremisePkg?.id}
					type={onPremisePkg?.type}
					title="ON PREMISE"
					price="NOT AVAILABLE"
					disable
					donate
					onSubscribe={() => subscribe(onPremisePkg?.id, onPremisePkg?.type)}
				>
					<ul className="list-disc px-8">
						<li>Running on our cloud</li>
						<li>High availability</li>
						<li>Unlimited concurrent builds</li>
						<li>Unlimited projects</li>
						<li>Unlimited apps</li>
						<li>
							Up to <Tag color="error">10x</Tag>app's container size
						</li>
					</ul>
				</PackageCard>
			</Col>
		</Row>
	);
};

export default PackageContainer;
