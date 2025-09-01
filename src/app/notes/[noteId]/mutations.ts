/* eslint-disable react-hooks/rules-of-hooks */
import {
  deleteLocalNote,
  updateLocalNoteArchive,
  updateLocalNoteFavorite,
  updateLocalNoteFolder,
  updateLocalNoteFont,
  updateLocalNoteFullWidth,
  updateLocalNoteLocked,
  updateLocalNoteSmallText,
  updateLocalNoteTrash,
} from "@/local/mutations/notes";
import { useMutation } from "@tanstack/react-query";
import { useUserId } from "../_components/user-context";
import type { FontType } from "@/text-editor/model/schema";
import { useRouter } from "next/navigation";

export const NOTE_MUTATIONS = {
  updateTrash: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (isTrashed: boolean) =>
        updateLocalNoteTrash({
          noteId,
          userId,
          data: { isTrashed },
        }),
      meta: {
        toastOnError: "Failed to move to trash, please try again.",
      },
    });
  },

  updateArchive: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (isArchived: boolean) =>
        updateLocalNoteArchive({
          noteId,
          userId,
          data: { isArchived },
        }),
      meta: {
        toastOnError: "Failed to archive, please try again.",
      },
    });
  },

  updateFavorite: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (isFavorite: boolean) =>
        updateLocalNoteFavorite({
          noteId,
          userId,
          data: { isFavorite },
        }),
      meta: {
        toastOnError: "Failed to toggle favorite, please try again.",
      },
    });
  },

  updateFolder: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (folderId: string) =>
        updateLocalNoteFolder({
          noteId,
          userId,
          data: { folderId },
        }),
      meta: {
        toastOnError: "Failed to update folder, please try again.",
      },
    });
  },

  updateFont: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (font: FontType) =>
        updateLocalNoteFont({ noteId, userId, data: { font } }),
      meta: {
        toastOnError: "Failed to update font, please try again.",
      },
    });
  },

  updateSmallText: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (smallText: boolean) =>
        updateLocalNoteSmallText({
          noteId,
          userId,
          data: { smallText },
        }),
      meta: {
        toastOnError: "Failed to update small text, please try again.",
      },
    });
  },

  updateLocked: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (locked: boolean) =>
        updateLocalNoteLocked({ noteId, userId, data: { locked } }),
      meta: {
        toastOnError: "Failed to update locked, please try again.",
      },
    });
  },

  updateFullWidth: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: (fullWidth: boolean) =>
        updateLocalNoteFullWidth({
          noteId,
          userId,
          data: { fullWidth },
        }),
      meta: {
        toastOnError: "Failed to update full width, please try again.",
      },
    });
  },

  restoreNote: (noteId: string) => {
    const userId = useUserId();

    return useMutation({
      mutationFn: () =>
        updateLocalNoteTrash({
          noteId,
          userId,
          data: { isTrashed: false },
        }),
      meta: {
        toastOnError: "Failed to restore note, please try again.",
      },
    });
  },

  deleteNote: (noteId: string) => {
    const router = useRouter();
    const userId = useUserId();

    return useMutation({
      mutationFn: () => deleteLocalNote({ noteId, userId }),
      meta: {
        toastOnError: "Failed to delete note, please try again.",
      },
      onMutate: () => {
        router.push("/notes");
      },
    });
  },
};
