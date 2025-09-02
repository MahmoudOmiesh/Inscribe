import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";
import { useUserId } from "@/app/notes/_components/user-context";
import Dexie from "dexie";

export function useLocalFolder(folderId: string) {
  return useLiveQuery(
    () => localDB.folders.where("id").equals(folderId).first(),
    [folderId],
  );
}

export function useLocalFolders() {
  const userId = useUserId();
  return useLiveQuery(() =>
    localDB.folders
      .where("[userId+sortOrder]")
      .between([userId, Dexie.minKey], [userId, Dexie.maxKey])
      .toArray(),
  );
}

export function useLocalFolderNotes(folderId: string) {
  return useLiveQuery(
    () =>
      localDB.notes
        .where("[folderId+sortOrder]")
        .between([folderId, Dexie.minKey], [folderId, Dexie.maxKey])
        .and((note) => !note.isTrashed && !note.isArchived)
        .toArray(),
    [folderId],
  );
}
