import { SearchOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";

import { Admin } from "@/templates/Admin";
import { api } from "@/utils/api";

const Customers = (props: any): JSX.Element => {
	const dataSource: any = [
		{
			key: "1",
			name: "Mike",
			age: 32,
			address: "10 Downing Street",
		},
		{
			key: "2",
			name: "John",
			age: 42,
			address: "10 Downing Street",
		},
	];

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
	];

	const data = api.pages.getAll.useQuery();
	return (
		<Admin>
			<div className="pt-6">
				<div className="filter-group pb-4">
					<div className="action-group flex justify-end">
						<Space wrap>
							<Button type="primary" size="large" icon={<SearchOutlined />}>
								Search
							</Button>
						</Space>
					</div>
				</div>
				<Table columns={columns} dataSource={dataSource} bordered />
			</div>
		</Admin>
	);
};

export default Customers;
