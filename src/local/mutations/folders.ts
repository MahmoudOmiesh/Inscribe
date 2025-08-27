import { localDB } from "../db";
import type { FolderInsert, FolderOrder } from "@/lib/schema/folder";
import { operationQueue } from "@/sync/operation-queue";
import Dexie from "dexie";
import { nanoid } from "nanoid";

export async function createLocalFolder({
  userId,
  data,
}: {
  userId: string;
  data: FolderInsert;
}) {
  const lastFolder = await localDB.folders
    .where("[userId+sortOrder]")
    .between([userId, Dexie.minKey], [userId, Dexie.maxKey])
    .last();

  const sortOrder = (lastFolder?.sortOrder ?? 0) + 1;

  const folderId = await localDB.folders.add({
    id: nanoid(),
    userId,
    emoji: data.emoji,
    name: data.name,
    sortOrder,

    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  await operationQueue.add({
    userId,
    operation: {
      folderId,
      type: "createFolder",
      data: {
        ...data,
        sortOrder,
      },
    },
  });

  return folderId;
}

export async function updateLocalFolder({
  folderId,
  userId,
  data,
}: {
  folderId: string;
  userId: string;
  data: FolderInsert;
}) {
  const updatedFolderCount = await localDB.folders.update(folderId, {
    ...data,
    updatedAt: Date.now(),
  });

  await operationQueue.add({
    userId,
    operation: {
      folderId,
      type: "updateFolder",
      data,
    },
  });

  return updatedFolderCount;
}

export async function deleteLocalFolder({
  folderId,
  userId,
}: {
  folderId: string;
  userId: string;
}) {
  const deletedCount = await localDB.deleteFolder(folderId);

  await operationQueue.add({
    userId,
    operation: {
      folderId,
      type: "deleteFolder",
    },
  });

  return deletedCount;
}

export async function reorderLocalFolders({
  userId,
  data,
}: {
  userId: string;
  data: FolderOrder;
}) {
  const updatedFolderCount = await localDB.folders.bulkUpdate(
    data.map((item) => ({
      key: item.id,
      changes: {
        sortOrder: item.order,
        updatedAt: Date.now(),
      },
    })),
  );

  await operationQueue.add({
    userId,
    operation: {
      type: "reorderFolders",
      data,
    },
  });

  return updatedFolderCount;
}
