import { Layout } from "antd";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { AdminMenuSider } from "@/commons/AdminMenuSider";
import { MenuSider } from "@/commons/MenuSider";
import { PageFooter } from "@/commons/PageFooter";
import { SiteHeader } from "@/commons/SiteHeader";
import { useLayoutProvider } from "@/providers/LayoutProvider";

type ISiteLayoutProps = {
	meta: ReactNode;
	children: ReactNode;
	showMenu?: boolean;
	useSidebar: boolean;
};

export const SiteLayout = (props: ISiteLayoutProps) => {
	const { useSidebar } = props;
	const router = useRouter();
	const { sidebarCollapsed } = useLayoutProvider();
	let marginLeft: string | number = "auto";
	if (useSidebar) marginLeft = sidebarCollapsed ? 80 : 200;

	const isAccountPage = router.asPath.startsWith("/account");
	const isAdminPage = router.asPath.startsWith("/admin");

	return (
		<Layout hasSider>
			{/* Meta tags */}
			{props.meta}

			{/* Sidebar here */}
			{useSidebar && isAccountPage && <MenuSider />}
			{useSidebar && isAdminPage && <AdminMenuSider />}

			<Layout className="min-h-screen transition-all" style={{ marginLeft }}>
				{/* Site Header */}
				{useSidebar && <SiteHeader />}

				{/* Page content here */}
				<div className="grow px-2">{props.children}</div>

				{/* Site/Page Footer */}
				<PageFooter />
			</Layout>
		</Layout>
	);
};
