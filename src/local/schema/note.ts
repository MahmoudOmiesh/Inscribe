import type { EditorNode, FontType } from "@/text-editor/model/schema";

export interface LocalNote {
  id: string;
  userId: string;
  folderId: string;

  title: string;
  content: EditorNode[];
  sortOrder: number;

  isArchived: 0 | 1;
  isTrashed: 0 | 1;
  isFavorite: 0 | 1;

  font: FontType;
  smallText: boolean;
  locked: boolean;
  fullWidth: boolean;

  createdAt: number;
  updatedAt: number;

  searchWords: string[];
}
