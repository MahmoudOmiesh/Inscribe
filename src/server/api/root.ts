import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { folderRouter } from "./routers/folder";
import { noteRouter } from "./routers/notes";

export const appRouter = createTRPCRouter({
  user: userRouter,
  folder: folderRouter,
  note: noteRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
