import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";
import { useUserId } from "@/app/notes/_components/user-context";
import Dexie from "dexie";

export function useLocalNote(noteId: string) {
  return useLiveQuery(() => localDB.notes.get(noteId), [noteId], {
    isPending: true,
  });
}

export function useLocalNoteFavorites() {
  const userId = useUserId();
  return useLiveQuery(() =>
    localDB.notes
      .where("[userId+isFavorite+isTrashed+isArchived+createdAt]")
      .between([userId, 1, 0, 0, Dexie.minKey], [userId, 1, 0, 0, Dexie.maxKey])
      .toArray(),
  );
}

export function useLocalNoteArchive() {
  const userId = useUserId();
  return useLiveQuery(() =>
    localDB.notes
      .where("[userId+isArchived+isTrashed+createdAt]")
      .between([userId, 1, 0, Dexie.minKey], [userId, 1, 0, Dexie.maxKey])
      .toArray(),
  );
}

export function useLocalNoteTrash() {
  const userId = useUserId();
  return useLiveQuery(() =>
    localDB.notes
      .where("[userId+isTrashed+createdAt]")
      .between([userId, 1, Dexie.minKey], [userId, 1, Dexie.maxKey])
      .toArray(),
  );
}
