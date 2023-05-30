import pkg from "package.json";
import { generateOpenApiDocument } from "trpc-openapi";

import { Config } from "@/utils/AppConfig";

import { appRouter } from "./api/root";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
	title: "Diginext API",
	description: "OpenAPI compliant REST API for Diginext platform.",
	version: pkg.version,
	baseUrl: `${Config.NEXT_PUBLIC_BASE_URL}/api`,
	docsUrl: `${Config.NEXT_PUBLIC_BASE_URL}/api-docs`,
	// tags: ["auth", "users", "posts"],
});
