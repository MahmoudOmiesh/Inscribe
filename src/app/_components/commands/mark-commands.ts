import { getSelectionRange } from "../utils/range";
import type { Mark, Operation } from "../utils/types";

export function createToggleMarkCommand(
  markType: Mark["type"],
): Operation | null {
  const range = getSelectionRange();
  if (!range) return null;

  return {
    type: "toggleMark",
    markType,
    range,
  };
}
