import type { FolderInsert, FolderOrder } from "@/lib/schema/folder";
import { db } from "./root";

export const _folders = {
  queries: {
    getAllSince: async (userId: string, since: number) => {
      return db.folder.findMany({
        where: { userId, updatedAt: { gt: new Date(since) } },
        orderBy: { sortOrder: "asc" },
      });
    },
  },

  mutations: {
    create: async (
      folderId: string,
      userId: string,
      data: FolderInsert & { sortOrder: number },
    ) => {
      return db.folder.create({
        data: {
          id: folderId,
          userId,
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

    update: async (folderId: string, userId: string, data: FolderInsert) => {
      const { count } = await db.folder.updateMany({
        where: { id: folderId, userId },
        data: {
          ...data,
        },
      });

      return { count, id: folderId };
    },

    delete: async (folderId: string, userId: string) => {
      const { count } = await db.folder.deleteMany({
        where: { id: folderId, userId },
      });

      return { count, id: folderId };
    },

    reorder: async (userId: string, data: FolderOrder) => {
      const folderUpdatePromises = data.map((item) =>
        db.folder.update({
          where: { id: item.id, userId },
          data: {
            sortOrder: item.order,
          },
          select: {
            id: true,
            sortOrder: true,
          },
        }),
      );

      const updatedFolders = await db.$transaction(folderUpdatePromises);
      return updatedFolders;
    },
  },
};
