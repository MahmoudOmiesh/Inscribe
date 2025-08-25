import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";

export function useLocalNote(noteId: string) {
  return useLiveQuery(() => localDB.notes.get(noteId), [noteId], {
    isPending: true as const,
  });
}
