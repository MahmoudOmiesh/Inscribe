import type { FolderInsert } from "@/lib/schema/folder";
import { db } from "./root";

export const _folders = {
  mutations: {
    create: async (userId: string, data: FolderInsert) => {
      const last = await db.folder.findFirst({
        where: { userId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });

      const sortOrder = (last?.sortOrder ?? 0) + 1;

      return db.folder.create({
        data: {
          userId,
          sortOrder,
          ...data,
        },
        select: {
          id: true,
          name: true,
          sortOrder: true,
          createdAt: true,
        },
      });
    },

    update: async (folderId: number, userId: string, data: FolderInsert) => {
      const { count } = await db.folder.updateMany({
        where: { id: folderId, userId },
        data: {
          ...data,
        },
      });

      return { count, id: folderId };
    },

    delete: async (folderId: number, userId: string) => {
      const { count } = await db.folder.deleteMany({
        where: { id: folderId, userId },
      });

      return { count, id: folderId };
    },
  },
};
