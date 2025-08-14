import type { CaretPosition, SelectionRange } from "../model/selection";
import type { EditorState } from "../state/editor-state";
import type { Step } from "../state/transaction";

export function setRangeStep(range: CaretPosition | SelectionRange): Step {
  return (state: EditorState) => {
    return {
      ...state,
      selection:
        "nodeId" in range
          ? {
              start: range,
              end: range,
              isCollapsed: true,
            }
          : range,
    };
  };
}
