import {
  deleteLocalNote,
  duplicateLocalNote,
  updateLocalNoteArchive,
  updateLocalNoteContent,
  updateLocalNoteFavorite,
  updateLocalNoteFolder,
  updateLocalNoteFont,
  updateLocalNoteFullWidth,
  updateLocalNoteLocked,
  updateLocalNoteSmallText,
  updateLocalNoteTitle,
  updateLocalNoteTrash,
} from "@/local/mutations/notes";
import { useMutation } from "@tanstack/react-query";
import { useUserId } from "../_components/user-context";
import type {
  EditorNode,
  ExportFormat,
  FontType,
} from "@/text-editor/model/schema";
import { usePathname, useRouter } from "next/navigation";
import { exportToHtml } from "@/text-editor/export/html";
import type { LocalNote } from "@/local/schema/note";
import { exportToMarkdown } from "@/text-editor/export/md";

export function useNoteMutations(noteId: string) {
  const pathname = usePathname();
  const userId = useUserId();
  const router = useRouter();

  return {
    duplicateNote: useMutation({
      mutationFn: () => duplicateLocalNote({ noteId, userId }),
      onSuccess: (id) => {
        router.push(`/notes/${id}`);
      },
      meta: {
        toastOnError: "Failed to duplicate note, please try again.",
      },
    }),

    updateTitle: useMutation({
      mutationFn: (title: string) =>
        updateLocalNoteTitle({ noteId, userId, data: { title } }),
      meta: {
        toastOnError: "Failed to update title, please try again.",
      },
      networkMode: "always",
    }),

    updateContent: useMutation({
      mutationFn: (content: EditorNode[]) =>
        updateLocalNoteContent({ noteId, userId, data: { content } }),
      meta: {
        toastOnError: "Failed to update content, please try again.",
      },
      networkMode: "always",
    }),

    updateTrash: useMutation({
      mutationFn: (isTrashed: boolean) =>
        updateLocalNoteTrash({
          noteId,
          userId,
          data: { isTrashed },
        }),
      meta: {
        toastOnError: "Failed to move to trash, please try again.",
      },
      networkMode: "always",
    }),

    updateArchive: useMutation({
      mutationFn: (isArchived: boolean) =>
        updateLocalNoteArchive({
          noteId,
          userId,
          data: { isArchived },
        }),
      meta: {
        toastOnError: "Failed to archive, please try again.",
      },
      networkMode: "always",
    }),

    updateFavorite: useMutation({
      mutationFn: (isFavorite: boolean) =>
        updateLocalNoteFavorite({
          noteId,
          userId,
          data: { isFavorite },
        }),
      meta: {
        toastOnError: "Failed to toggle favorite, please try again.",
      },
      networkMode: "always",
    }),

    updateFolder: useMutation({
      mutationFn: (folderId: string) =>
        updateLocalNoteFolder({
          noteId,
          userId,
          data: { folderId },
        }),
      meta: {
        toastOnError: "Failed to update folder, please try again.",
      },
      networkMode: "always",
    }),

    updateFont: useMutation({
      mutationFn: (font: FontType) =>
        updateLocalNoteFont({ noteId, userId, data: { font } }),
      meta: {
        toastOnError: "Failed to update font, please try again.",
      },
    }),

    updateSmallText: useMutation({
      mutationFn: (smallText: boolean) =>
        updateLocalNoteSmallText({
          noteId,
          userId,
          data: { smallText },
        }),
      meta: {
        toastOnError: "Failed to update small text, please try again.",
      },
      networkMode: "always",
    }),

    updateLocked: useMutation({
      mutationFn: (locked: boolean) =>
        updateLocalNoteLocked({ noteId, userId, data: { locked } }),
      meta: {
        toastOnError: "Failed to update locked, please try again.",
      },
      networkMode: "always",
    }),

    updateFullWidth: useMutation({
      mutationFn: (fullWidth: boolean) =>
        updateLocalNoteFullWidth({
          noteId,
          userId,
          data: { fullWidth },
        }),
      meta: {
        toastOnError: "Failed to update full width, please try again.",
      },
      networkMode: "always",
    }),

    restoreNote: useMutation({
      mutationFn: () =>
        updateLocalNoteTrash({
          noteId,
          userId,
          data: { isTrashed: false },
        }),
      meta: {
        toastOnError: "Failed to restore note, please try again.",
      },
      networkMode: "always",
    }),

    deleteNote: useMutation({
      mutationFn: () => deleteLocalNote({ noteId, userId }),
      meta: {
        toastOnError: "Failed to delete note, please try again.",
      },
      onMutate: () => {
        if (pathname === `/notes/${noteId}`) {
          router.push("/notes");
        }
      },
      networkMode: "always",
    }),

    copyNoteLink: useMutation({
      mutationFn: () =>
        navigator.clipboard.writeText(
          `${window.location.origin}/notes/${noteId}`,
        ),
      meta: {
        toastOnError: "Failed to copy note link, please try again.",
        onSuccessMessage: "Copied to clipboard",
      },
      networkMode: "always",
    }),
  };
}

export function exportNote({
  note,
  format,
  editorNodes,
}: {
  note: LocalNote;
  format: ExportFormat;
  editorNodes: EditorNode[];
}) {
  switch (format) {
    case "html": {
      const html = exportToHtml(editorNodes, {
        title: note.title,
        smallText: note.smallText,
        font: note.font,
      });
      const blob = new Blob([html], { type: "text/html" });
      downloadFile(blob, `${note.title}-${note.id}-export.html`);
      break;
    }
    case "markdown": {
      const markdown = exportToMarkdown(editorNodes, note.title);
      const blob = new Blob([markdown], { type: "text/markdown" });
      downloadFile(blob, `${note.title}-${note.id}-export.${format}`);
      break;
    }
    default:
      const _: never = format;
      return _;
  }

  function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
