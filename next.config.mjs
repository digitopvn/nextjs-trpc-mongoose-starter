/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import bundleAnalyzer from "@next/bundle-analyzer";

// eslint-disable-next-line import/extensions, @typescript-eslint/no-unused-expressions
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import("next").NextConfig} */
const config = withBundleAnalyzer({
	reactStrictMode: true,
	eslint: {
		dirs: ["."],
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
		tsconfigPath: "./tsconfig.json",
	},
	poweredByHeader: false,
	trailingSlash: true,
	output: "standalone",
	// basePath: "",
	/**
	 * If you have the "experimental: { appDir: true }" setting enabled, then you
	 * must comment the below `i18n` config out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 */
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	/**
	 * Use "webpack" instead of "swc"?
	 */
	// webpack: (config) => {
	// 	// eslint-disable-next-line no-param-reassign
	// 	config.resolve.fallback = { fs: false, path: false };
	// 	return config;
	// },
});
export default config;
