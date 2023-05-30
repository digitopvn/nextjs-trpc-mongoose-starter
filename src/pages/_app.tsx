import "@/styles/globals.css";
import "antd/dist/reset.css";

import { ConfigProvider, theme } from "antd";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ConfigProvider>
	);
};

export default api.withTRPC(MyApp);
