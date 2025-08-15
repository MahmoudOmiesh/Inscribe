import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { folderRouter } from "./routers/folder";

export const appRouter = createTRPCRouter({
  user: userRouter,
  folder: folderRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
