import { useLiveQuery } from "dexie-react-hooks";
import { localDB } from "../db";
import { useUserId } from "@/app/notes/_components/user-context";
import Dexie from "dexie";

export function useLocalNote(noteId: string) {
  return useLiveQuery(
    () => {
      return localDB.transaction(
        "r",
        [localDB.notes, localDB.folders],
        async () => {
          const note = await localDB.notes.get(noteId);
          if (!note) return undefined;

          const folder = await localDB.folders.get(note.folderId);
          if (!folder) return undefined;

          // await new Promise((resolve) => setTimeout(resolve, 2000));

          return {
            ...note,
            folderName: folder.name,
            folderEmoji: folder.emoji,
          };
        },
      );
    },
    [noteId],
    {
      isPending: true,
    },
  );
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

export function useLocalNotesSearch(query: string) {
  const userId = useUserId();
  return useLiveQuery(async () => {
    const q = query.trim();
    if (q === "") return [];

    const words = q.split(/\s+/);

    const noteKeys = await Promise.all(
      words.map((word) =>
        localDB.notes
          .where("searchWords")
          .startsWithIgnoreCase(word)
          .filter(
            (note) =>
              note.userId === userId && !note.isTrashed && !note.isArchived,
          )
          .distinct()
          .primaryKeys(),
      ),
    );

    const intersection = noteKeys.reduce(
      (common, keys) => {
        const set = new Set(common);
        return keys.filter((key) => set.has(key));
      },
      [...(noteKeys[0] ?? [])],
    );

    return (await localDB.notes.bulkGet(intersection)).filter(
      (note) => note !== undefined,
    );
  }, [query]);
}

export function useFirstNote() {
  const userId = useUserId();
  return useLiveQuery(
    () =>
      localDB.notes
        .where("[userId+isFavorite+isTrashed+isArchived+createdAt]")
        .between(
          [userId, 0, 0, 0, Dexie.minKey],
          [userId, 1, 0, 0, Dexie.maxKey],
        )
        .first(),
    [userId],
    {
      isPending: true,
    },
  );
}
