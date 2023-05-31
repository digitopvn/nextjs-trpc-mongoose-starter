import { DashboardOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import { trimEnd, trimStart } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDarkMode } from "usehooks-ts";

import { useLayoutProvider } from "@/providers/LayoutProvider";

const items: MenuProps["items"] = [
	{
		key: `menu/admin/dashboard`,
		icon: <DashboardOutlined />,
		label: "Thống kê",
	},
	{
		key: `menu/admin/customers`,
		icon: <DashboardOutlined />,
		label: "Khách hàng",
	},
	{
		key: `menu/admin/pages`,
		icon: <DashboardOutlined />,
		label: "Trang",
	},
	{
		key: `menu/admin/pages`,
		icon: <DashboardOutlined />,
		label: "Zone",
	},
	{
		key: `menu/admin/pages`,
		icon: <DashboardOutlined />,
		label: "Người đăng kí",
	},
	{
		key: `menu/admin/pages`,
		icon: <DashboardOutlined />,
		label: "Quản trị",
	},
	{
		key: `menu/admin/pages`,
		icon: <DashboardOutlined />,
		label: "Hoạt động",
	},
	// {
	// 	key: `menu/admin/settings`,
	// 	icon: <SettingOutlined />,
	// 	label: "Settings",
	// 	disabled: true,
	// },
];

export const AdminMenuSider = () => {
	const router = useRouter();
	const { sidebarCollapsed, toggleSidebar } = useLayoutProvider();
	const { isDarkMode } = useDarkMode();

	const pageLv0 = `menu/${trimStart(router.pathname, "/").split("/")[0]}`;
	const menuPath = `menu${trimEnd(router.pathname, "/")}`;
	// console.log("menuPath :>> ", menuPath);

	const onMenuSelected: MenuProps["onSelect"] = (e: any) => {
		// console.log("e", e);
		const path = trimStart(e.key, "menu");
		router.push(path);
	};

	return (
		<Sider
			theme="light"
			collapsible
			collapsed={sidebarCollapsed}
			onCollapse={(value) => toggleSidebar && toggleSidebar(value)}
			style={{
				overflow: "auto",
				height: "100vh",
				position: "fixed",
				left: 0,
				top: 0,
				bottom: 0,
			}}
		>
			{sidebarCollapsed ? (
				<div className="mx-auto my-5 w-[32px]">
					<Link href="/admin/dashboard">
						<img
							src={
								isDarkMode ? `${router.basePath}/assets/images/diginext-icon-white.svg` : `${router.basePath}/assets/images/diginext-icon-black.svg`
							}
							alt="Diginext Logo"
						/>
					</Link>
				</div>
			) : (
				<div className="mx-auto my-5 w-36">
					<Link href="/admin/dashboard">
						<img
							src={isDarkMode ? `${router.basePath}/assets/images/diginext_logo_white.svg` : `${router.basePath}/assets/images/diginext_logo.svg`}
							alt="Diginext Logo"
						/>
					</Link>
				</div>
			)}

			<Menu
				mode="inline"
				inlineCollapsed={sidebarCollapsed}
				defaultOpenKeys={[pageLv0]}
				defaultSelectedKeys={[pageLv0, menuPath]}
				items={items}
				onSelect={onMenuSelected}
			/>
		</Sider>
	);
};
