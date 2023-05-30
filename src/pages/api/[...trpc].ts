import { createOpenApiNextHandler } from "trpc-openapi";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export default createOpenApiNextHandler({ router: appRouter, createContext: createTRPCContext });
