import { Button, Card, Tag, Typography } from "antd";
import type { ReactNode } from "react";
import React from "react";

const PackageCard = (props?: {
	children?: ReactNode;
	id?: string;
	type?: string;
	title?: string;
	price?: string;
	donate?: boolean;
	highlight?: boolean;
	disable?: boolean;
	onSubscribe?: () => void;
}) => {
	const actions = [
		<Button
			key="subscribe-btn"
			type={props?.highlight === true ? "primary" : "default"}
			size={props?.highlight === true ? "large" : "middle"}
			disabled={props?.disable}
			onClick={() => (props?.onSubscribe ? props?.onSubscribe() : null)}
		>
			Subscribe
		</Button>,
	];

	if (props?.donate)
		actions.push(
			<Button
				key="donate-btn"
				type="primary"
				danger
				href="https://github.com/digitopvn/diginext#credits--donations"
				target="_blank"
				style={{ width: "auto" }}
			>
				Donate
			</Button>
		);

	return (
		<Card
			title={
				<div className="py-4 text-center">
					<Tag>{props?.price || "FREE"}</Tag>
					<Typography.Title level={3} style={{ marginBottom: 0 }} type={props?.highlight ? "success" : undefined}>
						{props?.title || "Hobby"}
					</Typography.Title>
				</div>
			}
			actions={actions}
		>
			{props?.children}
		</Card>
	);
};

export default PackageCard;
