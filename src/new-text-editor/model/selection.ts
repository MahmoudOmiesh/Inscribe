import type { ActiveMarkDescriptor, EditorNode } from "./schema";

export interface CaretPosition {
  nodeId: string;
  offset: number;
}

export interface SelectionRange {
  start: CaretPosition;
  end: CaretPosition;
  isCollapsed: boolean;
}

export function isSameRange(range1: SelectionRange, range2: SelectionRange) {
  return (
    range1.start.nodeId === range2.start.nodeId &&
    range1.start.offset === range2.start.offset &&
    range1.end.nodeId === range2.end.nodeId &&
    range1.end.offset === range2.end.offset
  );
}

export function getActiveMarksOverRange(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
): ActiveMarkDescriptor[] {
  const firstNodeIndex = nodeIdIndex.get(range.start.nodeId);
  const lastNodeIndex = nodeIdIndex.get(range.end.nodeId);

  if (firstNodeIndex === undefined || lastNodeIndex === undefined) return [];

  const firstNode = nodes[firstNodeIndex]!;
  const lastNode = nodes[lastNodeIndex]!;

  if (firstNodeIndex === lastNodeIndex) {
    const marks = firstNode.marks.filter(
      (m) =>
        m.start <= range.start.offset - Number(range.isCollapsed) &&
        m.end >= range.end.offset,
    );

    return marks.map((m) => {
      if (m.type === "highlight") {
        return {
          type: m.type,
          color: m.color,
        };
      } else {
        return {
          type: m.type,
        };
      }
    });
  }

  const firstNodeMarks = firstNode.marks.filter(
    (m) => m.start <= range.start.offset && m.end === firstNode.text.length,
  );
  const middleMarks = nodes
    .slice(firstNodeIndex + 1, lastNodeIndex)
    .flatMap((n) =>
      n.marks.filter((m) => m.start === 0 && m.end === n.text.length),
    );

  const lastNodeMarks = lastNode.marks.filter(
    (m) => m.start === 0 && m.end >= range.end.offset,
  );

  const intersection = firstNodeMarks.filter((m) => {
    const existsInLastNode = lastNodeMarks.some((m2) => m.type === m2.type);
    const doesMiddleExist = lastNodeIndex - firstNodeIndex > 1;
    const existsInMiddle = doesMiddleExist
      ? middleMarks.some((m2) => m.type === m2.type)
      : true;
    return existsInLastNode && existsInMiddle;
  });

  return intersection.map((m) => {
    if (m.type === "highlight") {
      return {
        type: m.type,
        color: m.color,
      };
    } else {
      return {
        type: m.type,
      };
    }
  });
}

export function getActiveBlockType(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  const firstNodeIndex = nodeIdIndex.get(range.start.nodeId);
  const lastNodeIndex = nodeIdIndex.get(range.end.nodeId);

  if (firstNodeIndex === undefined || lastNodeIndex === undefined) return null;

  const firstNode = nodes[firstNodeIndex]!;
  const type = firstNode.type;

  for (let i = firstNodeIndex + 1; i <= lastNodeIndex; i++) {
    const node = nodes[i]!;
    if (node.type !== type) return null;
  }

  return type;
}

export function getActiveBlockAlignment(
  nodes: EditorNode[],
  nodeIdIndex: Map<string, number>,
  range: SelectionRange,
) {
  const firstNodeIndex = nodeIdIndex.get(range.start.nodeId);
  const lastNodeIndex = nodeIdIndex.get(range.end.nodeId);

  if (firstNodeIndex === undefined || lastNodeIndex === undefined) return null;

  const firstNode = nodes[firstNodeIndex]!;
  const alignment = firstNode.alignment;

  for (let i = firstNodeIndex + 1; i <= lastNodeIndex; i++) {
    const node = nodes[i]!;
    if (node.alignment !== alignment) return null;
  }

  return alignment;
}
