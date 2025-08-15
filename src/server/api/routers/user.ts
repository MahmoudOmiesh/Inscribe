import { tryCatch } from "@/lib/try-catch";
import { authedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { DB } from "@/server/db";
import { TRPCError } from "@trpc/server";

const USER_ERRORS = {
  getFolders: {
    code: "INTERNAL_SERVER_ERROR" as const,
    message: "Failed to get folders",
  },
};

export const userRouter = createTRPCRouter({
  getFolders: authedProcedure.query(async ({ ctx }) => {
    const { data: folders, error: getFoldersError } = await tryCatch(
      DB.users.queries.getFolders(ctx.session.user.id),
    );

    if (getFoldersError) {
      throw new TRPCError(USER_ERRORS.getFolders);
    }

    return folders;
  }),
});
