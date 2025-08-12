import { isListItem } from "./lists";
import type {
  EditorNode,
  HeadingNode,
  ListItemNode,
  ParagraphNode,
} from "./schema";

import { nanoid } from "nanoid";

export function buildNodeIdxMap(nodes: EditorNode[]) {
  const map = new Map<string, number>();
  nodes.forEach((node, idx) => {
    map.set(node.id, idx);
  });
  return map;
}

export function cleanNode(node: EditorNode): EditorNode {
  const base = {
    id: node.id,
    text: node.text,
    alignment: node.alignment ?? "left",
    marks: node.marks ?? [],
  };

  if (isListItem(node)) {
    const listItem = {
      ...base,
      type: node.type,
      listId: node.listId,
      indentLevel: node.indentLevel,
    };

    if (node.type === "check-list-item") {
      return {
        ...listItem,
        checked: node.checked,
      };
    }

    return listItem as ListItemNode;
  }

  // Non-list blocks: strip list-specific props
  return {
    ...base,
    type: node.type,
  };
}

export function createParagraph(
  paragraph: Partial<Omit<ParagraphNode, "type">>,
): ParagraphNode {
  return {
    id: paragraph.id ?? nanoid(),
    type: "paragraph",
    text: paragraph.text ?? "",
    marks: paragraph.marks ?? [],
    alignment: paragraph.alignment ?? "left",
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
