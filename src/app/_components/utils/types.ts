/////////////////////
// Data Model Types
/////////////////////

export interface Mark {
  type: "bold" | "italic" | "underline" | "strikethrough";
  start: number;
  end: number;
}

export interface BaseNode {
  id: string;
  text: string;
  marks: Mark[];
}

export type HeadingNode = BaseNode & {
  type: "heading";
};

export type ParagraphNode = BaseNode & {
  type: "paragraph";
};

export type EditorNode = HeadingNode | ParagraphNode;

/////////////////////
// Operation Types
/////////////////////

export interface OperationBase {
  range: SelectionRange;
}

export type InsertTextOperation = {
  type: "insertText";
  text: string;
} & OperationBase;

export type InsertReplacementTextOperation = {
  type: "insertReplacementText";
  text: string;
} & OperationBase;

export type DeleteTextOperation = {
  type: "deleteText";
} & OperationBase;

export type MergeNodesOperation = {
  type: "mergeNodes";
  firstNodeId: string;
  secondNodeId: string;
} & OperationBase;

export type InsertParagraphOperation = {
  type: "insertParagraph";
  newNodeId: string;
} & OperationBase;

export type Operation =
  | InsertTextOperation
  | DeleteTextOperation
  | MergeNodesOperation
  | InsertParagraphOperation
  | InsertReplacementTextOperation;

export type OperationResult = {
  nodes: EditorNode[];
  newCaretPosition: CaretPosition | null;
};

/////////////////////
// Utils
/////////////////////

export interface CaretPosition {
  nodeId: string;
  offset: number;
}

export interface SelectionRange {
  start: CaretPosition;
  end: CaretPosition;
  isCollapsed: boolean;
}

export interface TextChange {
  offset: number;
  deletedLength: number;
  insertedLength: number;
}
