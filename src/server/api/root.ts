import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { syncRouter } from "./routers/sync";

export const appRouter = createTRPCRouter({
  sync: syncRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
