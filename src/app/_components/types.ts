/////////////////////
// Data Model Types
/////////////////////

export type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
};

export type BaseNode = {
  id: string;
  children: TextNode[];
};

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

export type OperationBase = {
  caretPosition: CaretPosition;
};

export type InsertTextOperation = {
  type: "insertText";
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
  | InsertParagraphOperation;

/////////////////////
// Utils
/////////////////////

export type CaretPosition = {
  nodeId: string;
  childIndex: number;
  offset: number;
};
