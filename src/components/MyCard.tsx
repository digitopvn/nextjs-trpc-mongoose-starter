import { Card, Tag, Typography } from "antd";
import type { ReactNode } from "react";
import React from "react";

const MyCard = (props?: {
	children?: ReactNode;
	id?: string;
	type?: string;
	title?: string;
	price?: string;
	donate?: boolean;
	highlight?: boolean;
	disable?: boolean;
	actions?: ReactNode[];
	onSubscribe?: () => void;
}) => {
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
			actions={props?.actions}
		>
			{props?.children}
		</Card>
	);
};

export default MyCard;
