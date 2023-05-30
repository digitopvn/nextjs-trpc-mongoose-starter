import { BookFilled, GithubOutlined, KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import CopyCode from "@/commons/CopyCode";

const AuthShowcase: React.FC = () => {
	const { data: sessionData } = useSession();

	return (
		<div className="flex max-w-lg flex-col items-center justify-center gap-4">
			{sessionData ? (
				<div className=" text-center text-xl text-white">
					<span>
						Great to see you here, <strong className="text-[hsl(280,100%,70%)]">{sessionData.user?.name}!</strong>
					</span>
				</div>
			) : (
				<div className="text-md text-center text-white">
					<span>A build server that run on your infrastructure and its Command Line Interface (CLI) with developer-friendly commands.</span>
				</div>
			)}
			<div className="text-center text-2xl text-white">
				<CopyCode mode="inline" value="npm i @topgroup/diginext --location=global" />
			</div>
			<Space>
				{sessionData && sessionData.user ? (
					<Button size="large" type="primary" href="/account" icon={<UserOutlined />}>
						Get your API key
					</Button>
				) : (
					<Button size="large" type="primary" onClick={() => signIn(undefined, { redirect: true, callbackUrl: "/account" })} icon={<KeyOutlined />}>
						Get your API key
					</Button>
				)}

				<Button
					size="large"
					type="primary"
					icon={<BookFilled />}
					// href="/documentation"
					href="https://topgroup.notion.site/Getting-Started-8d4155a1797641e6aa4ead9446868533"
					target="_blank"
				>
					Getting started
				</Button>
				<Button size="large" type="primary" href="https://github.com/digitopvn/diginext" target="_blank" icon={<GithubOutlined />}>
					Github
				</Button>
			</Space>
		</div>
	);
};

const Home: NextPage = () => {
	// const hello = api.example.hello.useQuery({ text: "from tRPC" });

	return (
		<>
			<Head>
				<title>Diginext | Home</title>
				<meta
					name="description"
					content="A BUILD SERVER that run on your infrastructure and its Command Line Interface (CLI) with developer-friendly commands. "
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center px-4 py-16 ">
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
						<span className="text-[hsl(280,100%,70%)]">digi</span>next
					</h1>
					<div className="flex flex-col items-center gap-2">
						<AuthShowcase />
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
