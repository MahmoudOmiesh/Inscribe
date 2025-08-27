import type { FolderInsert, FolderOrder } from "@/lib/schema/folder";
import type {
  NoteArchiveUpdate,
  NoteContentUpdate,
  NoteFavoriteUpdate,
  NoteFontUpdate,
  NoteLockedUpdate,
  NoteFullWidthUpdate,
  NoteSmallTextUpdate,
  NoteTitleUpdate,
  NoteTrashUpdate,
  NoteFolderUpdate,
  NoteInsert,
} from "@/lib/schema/note";

export interface SyncOperation {
  id: string;
  userId: string;
  timestamp: number;
  status: "pending" | "success" | "error";
  operation: FolderSyncOperation | NoteSyncOperation;
}

export type FolderSyncOperation =
  | {
      folderId: string;
      type: "createFolder";
      data: FolderInsert & {
        sortOrder: number;
      };
    }
  | {
      folderId: string;
      type: "updateFolder";
      data: FolderInsert;
    }
  | {
      type: "reorderFolders";
      data: FolderOrder;
    }
  | {
      folderId: string;
      type: "deleteFolder";
    };

export type NoteSyncOperation =
  | {
      noteId: string;
      type: "createNote";
      data: NoteInsert;
    }
  | {
      noteId: string;
      type: "updateNoteTitle";
      data: NoteTitleUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteContent";
      data: NoteContentUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteFavorite";
      data: NoteFavoriteUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteArchive";
      data: NoteArchiveUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteTrash";
      data: NoteTrashUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteFont";
      data: NoteFontUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteSmallText";
      data: NoteSmallTextUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteLocked";
      data: NoteLockedUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteFullWidth";
      data: NoteFullWidthUpdate;
    }
  | {
      noteId: string;
      type: "updateNoteFolder";
      data: NoteFolderUpdate;
    }
  | {
      noteId: string;
      type: "deleteNote";
    };
