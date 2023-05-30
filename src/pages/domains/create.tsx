import { Button, Input, Space, Typography } from "antd";
import { type NextPage } from "next";
import { useState } from "react";

import { api } from "../../utils/api";

const DomainCreatePage: NextPage = () => {
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const createApi = api.domains.create.useMutation();

	const create = () => {
		if (!name) {
			setMessage("Name is required.");
			return;
		}
		createApi.mutateAsync({ name, data: "118.69.128.28" }).then((res: any) => {
			setMessage(JSON.stringify(res, null, 2));
		});
	};

	return (
		<div className="max-w-lg p-5">
			<Typography.Title>Create domain</Typography.Title>
			<label>Subdomain name:</label>
			<Space.Compact block>
				<Input type="text" className="w-full" placeholder="<subdomain>.diginext.site" onChange={(e: any) => setName(e.currentTarget.value)} />
				<Button type="primary" onClick={() => create()}>
					Create
				</Button>
			</Space.Compact>
			<div className="mt-2">Result: {message}</div>
		</div>
	);
};

export default DomainCreatePage;
