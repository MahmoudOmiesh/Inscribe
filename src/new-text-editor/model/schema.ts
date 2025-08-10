export type BlockType =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "paragraph"
  | "unordered-list-item"
  | "ordered-list-item"
  | "check-list-item";

export type MarkType =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "superscript"
  | "subscript"
  | "highlight"
  | "code";

export type Alignment = "left" | "center" | "right" | "justify";

export type HighlightColor = "yellow" | "red" | "green" | "blue";

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
