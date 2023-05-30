import { DownOutlined, GithubFilled, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Popover, Space, theme } from "antd";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

import { useLayoutProvider } from "@/providers/LayoutProvider";
// import { useAuth } from "@/api/api-auth";

const { Header } = Layout;

type ISiteHeaderProps = { onSidebarChange?: (value: boolean) => void };

export const SiteHeader = (props: ISiteHeaderProps = {}) => {
	const { onSidebarChange } = props;
	const { isDarkMode, toggle } = useDarkMode();

	const { data: sessionData, status } = useSession();
	const user = sessionData?.user;

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const { sidebarCollapsed, toggleSidebar } = useLayoutProvider();

	useEffect(() => onSidebarChange && onSidebarChange(sidebarCollapsed), [sidebarCollapsed]);

	return (
		<Header
			className="w-full"
			style={{
				position: "sticky",
				top: 0,
				paddingInline: 24,
				lineHeight: "48px",
				height: 48,
				zIndex: 100,
				background: colorBgContainer,
			}}
		>
			<div className="flex ">
				{/* Open/close sidebar menu */}
				<div className="grow">
					{React.createElement(sidebarCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
						className: "trigger",
						onClick: () => toggleSidebar && toggleSidebar(),
					})}
				</div>

				{/* User & notification */}
				<Space size={4}>
					{/* <Button type="text" icon={<SearchOutlined />} /> */}
					<Button type="text" icon={<HomeOutlined />} href="/" />
					<Button type="text" icon={<GithubFilled />} href="https://github.com/digitopvn/diginext" target="_blank" />
					{/* eslint-disable-next-line tailwindcss/no-custom-classname */}
					<Button
						type="text"
						style={{ fontSize: 18, verticalAlign: "middle", paddingTop: 0 }}
						onClick={toggle}
						icon={isDarkMode ? <i className="ri-sun-line inline-block" /> : <i className="ri-moon-line inline-block" />}
					/>
					<Popover
						placement="bottomRight"
						trigger="click"
						content={
							<Space direction="vertical">
								<div className="text-center">
									<p className="mb-0">
										<strong>{user?.name}</strong>
									</p>
									<p className="mb-0">{user?.email}</p>
								</div>
								<Space.Compact direction="vertical" className="w-full">
									<Button href="/account">Profile</Button>
									<Button onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>Sign out</Button>
								</Space.Compact>
							</Space>
						}
					>
						<div className="cursor-pointer align-middle">
							<Avatar style={{ lineHeight: "20px" }} icon={<UserOutlined style={{ verticalAlign: "middle" }} />} src={user?.image} size={24} />
							<span className="ml-2 inline-block">{user?.name}</span>
							<DownOutlined className="ml-2" />
						</div>
					</Popover>
				</Space>
			</div>
		</Header>
	);
};
