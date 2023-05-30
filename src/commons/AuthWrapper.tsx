import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";

import CenterContainer from "./CenterContainer";

const AuthWrapper = (props?: { children?: ReactNode }) => {
	const { children } = props || {};
	const { data: sessionData, status } = useSession();
	const router = useRouter();

	if (status === "loading")
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<CenterContainer>
					<LoadingOutlined />
				</CenterContainer>
			</div>
		);

	if (status === "unauthenticated")
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center px-4 py-16 ">
					{/* LOGO */}
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						<span className="text-[hsl(280,100%,70%)]">digi</span>next
					</h1>
					<div className="flex max-w-lg flex-col items-center justify-center gap-4">
						<Typography.Text>Please sign in.</Typography.Text>
						<button
							className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
							onClick={sessionData ? () => signOut() : () => signIn()}
						>
							{sessionData ? "Sign out" : "Sign in"}
						</button>
					</div>
				</div>
			</div>
		);

	// TODO: sessionData -> authorization -> check path "/admin"
	if (router.asPath.startsWith("/admin") && sessionData?.user.role?.type !== "admin") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center px-4 py-16 ">
					{/* LOGO */}
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						<span className="text-[hsl(280,100%,70%)]">digi</span>next
					</h1>
					<div className="flex max-w-lg flex-col items-center justify-center gap-4">
						<Typography.Text>Permission denied.</Typography.Text>
						<Button icon={<HomeOutlined />} href="/">
							Home
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthWrapper;
