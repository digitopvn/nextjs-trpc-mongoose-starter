import { LoadingOutlined } from "@ant-design/icons";
import { notification, Typography } from "antd";
import { isEmpty } from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import CopyCode from "@/commons/CopyCode";
import { api } from "@/utils/api";
import type { GithubAccessTokenInfo } from "@/utils/types";

const GithubCallback: NextPage = () => {
	const [noti] = notification.useNotification();
	const router = useRouter();

	const { data: sessionData } = useSession();

	const [tokenInfo, setTokenInfo] = useState<GithubAccessTokenInfo>();
	const [message, setMessage] = useState("");
	const generateTokenApi = api.github.generateAccessToken.useMutation();

	const generateAccessToken = async (code: string) => {
		const res = await generateTokenApi.mutateAsync({ code });

		if (!isEmpty(res.messages)) setMessage(res.messages?.join(".") || "");

		setTokenInfo(res?.data);
	};

	useEffect(() => {
		if (router.query.code) generateAccessToken(router.query.code.toString());
	}, [router.query]);

	return (
		<>
			<Head>
				<title>Diginext | Github authorization</title>
				<meta name="description" content="Diginext Site" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="container flex flex-col items-center justify-center gap-4 p-4">
					<h2 className="text-3xl ">YOUR GITHUB ACCESS TOKEN</h2>
					{message && message !== "Ok." && <Typography.Text type="danger">{message}</Typography.Text>}
					{generateTokenApi.isLoading && (
						<span>
							<LoadingOutlined /> Generating...
						</span>
					)}
					{tokenInfo?.access_token && <CopyCode value={tokenInfo?.access_token || ""} type="password" mode="inline" />}

					{!sessionData && (
						<div>
							<p>You need to sign-in first.</p>
							<button
								className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
								onClick={() => signIn()}
							>
								Sign in
							</button>
						</div>
					)}
				</div>
			</main>
		</>
	);
};

export default GithubCallback;
