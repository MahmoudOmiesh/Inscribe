import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";

export function useLocalNote(noteId: string) {
  return useLiveQuery(() => localDB.notes.get(noteId), [noteId], {
    isPending: true,
  });
}

export function useLocalNoteFavorites() {
  return useLiveQuery(() =>
    localDB.notes
      .filter((note) => note.isFavorite && !note.isTrashed && !note.isArchived)
      .toArray(),
  );
}

export function useLocalNoteArchive() {
  return useLiveQuery(() =>
    localDB.notes
      .filter((note) => note.isArchived && !note.isTrashed)
      .toArray(),
  );
}

export function useLocalNoteTrash() {
  return useLiveQuery(() =>
    localDB.notes.filter((note) => note.isTrashed).toArray(),
  );
}
