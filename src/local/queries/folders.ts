import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";
import { useUserId } from "@/app/notes/_components/user-context";

export function useLocalFolders() {
  const userId = useUserId();
  return useLiveQuery(() =>
    localDB.folders.where("userId").equals(userId).sortBy("sortOrder"),
  );
}

export function useLocalFolderNotes(folderId: string) {
  return useLiveQuery(
    () =>
      localDB.notes
        .where("folderId")
        .equals(folderId)
        .and((note) => !note.isTrashed && !note.isArchived)
        .sortBy("sortOrder"),
    [folderId],
    {
      isPending: true as const,
    },
  );
}
