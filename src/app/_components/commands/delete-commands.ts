import { getSelectionRange } from "../utils/range";
import type { EditorNode, Operation } from "../utils/types";
import {
  findAdjacentNodes,
  shouldMergeNodesBackward,
  shouldMergeNodesForward,
} from "./helpers";

export function createDeleteBackwardCommand(
  nodes: EditorNode[],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  if (shouldMergeNodesBackward(range)) {
    const nodeIds = findAdjacentNodes(nodes, range.start.nodeId, "backward");
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;

    return {
      type: "mergeNodes",
      firstNodeId,
      secondNodeId,
      range,
    };
  }

  return {
    type: "deleteTextBackward",
    range,
  };
}

export function createDeleteWordBackwardCommand(
  nodes: EditorNode[],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  if (shouldMergeNodesBackward(range)) {
    const nodeIds = findAdjacentNodes(nodes, range.start.nodeId, "backward");
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;

    return {
      type: "mergeNodes",
      firstNodeId,
      secondNodeId,
      range,
    };
  }

  return {
    type: "deleteWordBackward",
    range,
  };
}

export function createDeleteForewardCommand(
  nodes: EditorNode[],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  if (shouldMergeNodesForward(range, nodes)) {
    const nodeIds = findAdjacentNodes(nodes, range.start.nodeId, "forward");
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;

    return {
      type: "mergeNodes",
      firstNodeId,
      secondNodeId,
      range,
    };
  }

  return {
    type: "deleteTextForward",
    range,
  };
}

export function createDeleteWordForwardCommand(
  nodes: EditorNode[],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  if (shouldMergeNodesForward(range, nodes)) {
    const nodeIds = findAdjacentNodes(nodes, range.start.nodeId, "forward");
    if (!nodeIds) return null;

    const [firstNodeId, secondNodeId] = nodeIds;

    return {
      type: "mergeNodes",
      firstNodeId,
      secondNodeId,
      range,
    };
  }

  return {
    type: "deleteWordForward",
    range,
  };
}

export function createDeleteByCutCommand(): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "deleteByCut",
    range,
  };
}
