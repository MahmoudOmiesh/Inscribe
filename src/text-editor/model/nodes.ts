import type {
  EditorNode,
  HeadingNode,
  ListItemNode,
  ParagraphNode,
} from "./schema";

import { nanoid } from "nanoid";
import { EditorNodeSchema } from "./zod";

export function buildNodeIdxMap(nodes: EditorNode[]) {
  const map = new Map<string, number>();
  nodes.forEach((node, idx) => {
    map.set(node.id, idx);
  });
  return map;
}

export function cleanNode(node: EditorNode): EditorNode {
  return EditorNodeSchema.parse(node);
}

export function createParagraph(
  paragraph?: Partial<Omit<ParagraphNode, "type">>,
): ParagraphNode {
  return {
    id: paragraph?.id ?? nanoid(),
    type: "paragraph",
    text: paragraph?.text ?? "",
    marks: paragraph?.marks ?? [],
    alignment: paragraph?.alignment ?? "left",
  };
}

export function createHeading(
  heading: Partial<Omit<HeadingNode, "type">> & {
    level: 1 | 2 | 3 | 4;
  },
): HeadingNode {
  return {
    id: heading.id ?? nanoid(),
    type: `heading-${heading.level}`,
    text: heading.text ?? "",
    marks: heading.marks ?? [],
    alignment: heading.alignment ?? "left",
  };
}

export function createListItem(
  listItem: Partial<Omit<ListItemNode, "type">> & {
    type: ListItemNode["type"];
    listId: ListItemNode["listId"];
  },
): ListItemNode {
  const base = {
    id: listItem.id ?? nanoid(),
    type: listItem.type,
    listId: listItem.listId,
    indentLevel: listItem.indentLevel ?? 0,
    text: listItem.text ?? "",
    marks: listItem.marks ?? [],
    alignment: listItem.alignment ?? "left",
  };

  if (listItem.type === "check-list-item") {
    return {
      ...base,
      checked: false,
    };
  }

  return base as ListItemNode;
}
