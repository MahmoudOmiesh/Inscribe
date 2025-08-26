import { localDB } from "../db";
import type { FolderInsert, FolderOrder } from "@/lib/schema/folder";
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
    serverId: null,
    emoji: data.emoji,
    name: data.name,
    sortOrder,

    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastSyncedAt: null,
  });

  return folderId;
}

export async function updateLocalFolder({
  folderId,
  data,
}: {
  folderId: string;
  data: FolderInsert;
}) {
  return localDB.folders.update(folderId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteLocalFolder({ folderId }: { folderId: string }) {
  return localDB.deleteFolder(folderId);
}

export async function reorderLocalFolders({ data }: { data: FolderOrder }) {
  return localDB.folders.bulkUpdate(
    data.map((item) => ({
      key: item.id,
      changes: {
        sortOrder: item.order,
        updatedAt: Date.now(),
      },
    })),
  );
}
