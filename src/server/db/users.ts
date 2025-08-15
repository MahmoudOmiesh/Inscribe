import { db } from "./root";

export const _users = {
  queries: {
    getFolders: (userId: string) => {
      return db.folder.findMany({
        where: {
          userId,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });
    },
  },
};
