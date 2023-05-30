import { GithubOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

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
			) : null}
			<Space>
				{sessionData && sessionData.user ? (
					<Button size="large" type="primary" href="/users" icon={<UserOutlined />}>
						Users
					</Button>
				) : (
					<Button
						size="large"
						type="primary"
						danger
						// redirect after sign-in
						// onClick={() => signIn(undefined, { redirect: true, callbackUrl: "/users" })}
						onClick={() => signIn()}
						icon={<LoginOutlined />}
					>
						Login
					</Button>
				)}

				<Button
					size="large"
					type="primary"
					href="https://github.com/digitopvn/nextjs-trpc-mongoose-starter"
					target="_blank"
					icon={<GithubOutlined />}
				>
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
				<meta name="description" content="Next.js, Mongoose and tRPC." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center px-4 py-16 ">
					<h1 className="text-center text-6xl font-extrabold tracking-tight text-white">
						<span className="text-[hsl(280,100%,70%)]">Next.js</span> + tRPC + <span className="text-rose-500">Mongoose</span>
					</h1>
					<div className="flex flex-col items-center gap-2 pb-5 text-purple-400">Hello, world!</div>
					<div className="flex flex-col items-center gap-2">
						<AuthShowcase />
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;
