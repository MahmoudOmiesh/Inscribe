export const BLOCK_TYPES = [
  "paragraph",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "unordered-list-item",
  "ordered-list-item",
  "check-list-item",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "superscript"
  | "subscript"
  | "highlight"
  | "code";

export const ALIGNMENT_TYPES = ["left", "center", "right", "justify"] as const;
export type Alignment = (typeof ALIGNMENT_TYPES)[number];

export const HIGHLIGHT_COLORS_CSS = {
  red: "rgb(244 67 54 / 0.28)",
  yellow: "rgb(255 193 7 / 0.28)",
  green: "rgb(76 175 80 / 0.28)",
  blue: "rgb(33 150 243 / 0.28)",
  pink: "rgb(255 205 210 / 0.28)",
  purple: "rgb(224 195 252 / 0.28)",
  orange: "rgb(255 213 181 / 0.28)",
  brown: "rgb(239 235 233 / 0.28)",
} as const;
export const HIGHLIGHT_COLORS = [
  "red",
  "yellow",
  "green",
  "blue",
  "pink",
  "purple",
  "orange",
  "brown",
] as const;
export type HighlightColor = (typeof HIGHLIGHT_COLORS)[number];

export type Mark =
  | {
      type: Exclude<MarkType, "highlight">;
      start: number;
      end: number;
    }
  | {
      type: "highlight";
      start: number;
      end: number;
      color: HighlightColor;
    };

export type ActiveMarkDescriptor =
  | {
      type: Exclude<MarkType, "highlight">;
    }
  | {
      type: "highlight";
      color: HighlightColor;
    };

export interface BaseNode {
  id: string;
  text: string;
  alignment: Alignment;
  marks: Mark[];
}

export type HeadingNode =
  | (BaseNode & { type: "heading-1" })
  | (BaseNode & { type: "heading-2" })
  | (BaseNode & { type: "heading-3" })
  | (BaseNode & { type: "heading-4" });

export type ParagraphNode = BaseNode & {
  type: "paragraph";
};

export type UnorderedListItemNode = BaseNode & {
  type: "unordered-list-item";
  listId: string;
  indentLevel: number;
};

export type OrderedListItemNode = BaseNode & {
  type: "ordered-list-item";
  listId: string;
  indentLevel: number;
};

export type CheckListItemNode = BaseNode & {
  type: "check-list-item";
  listId: string;
  indentLevel: number;
  checked: boolean;
};

export type ListItemNode =
  | UnorderedListItemNode
  | OrderedListItemNode
  | CheckListItemNode;

export type EditorNode = HeadingNode | ParagraphNode | ListItemNode;
