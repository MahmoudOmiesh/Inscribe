import { useCallback } from "react";
import type { EditorState } from "../state/editor-state";
import type { Transaction } from "../state/transaction";
import {
  textCommands,
  deleteCommands,
  formatCommands,
  listCommands,
} from "../commands";
import type {
  ActiveMarkDescriptor,
  Alignment,
  BlockType,
} from "../model/schema";

export function useEditorActions(
  getState: () => EditorState,
  dispatch: (tx: Transaction) => void,
  preserveTypingMarksAtCurrentPosition: () => void,
) {
  const doTx = useCallback(
    (build: (s: EditorState) => Transaction | null, preserve = false) => {
      const s = getState();
      const tx = build(s);
      if (tx) dispatch(tx);

      if (preserve) {
        preserveTypingMarksAtCurrentPosition();
      }
    },
    [getState, dispatch, preserveTypingMarksAtCurrentPosition],
  );

  return {
    insertText: (text: string) => doTx((s) => textCommands.insertText(s, text)),
    insertParagraph: () => doTx((s) => textCommands.insertParagraph(s)),
    paste: (content: string, type: "plain" | "html") =>
      doTx((s) => textCommands.paste(s, content, type)),

    deleteBackward: () => doTx((s) => deleteCommands.deleteBackward(s)),
    deleteForward: () => doTx((s) => deleteCommands.deleteForward(s)),
    deleteWordBackward: () => doTx((s) => deleteCommands.deleteWordBackward(s)),
    deleteWordForward: () => doTx((s) => deleteCommands.deleteWordForward(s)),

    toggleMark: (mark: ActiveMarkDescriptor) =>
      doTx((s) => formatCommands.toggleMark(s, mark), true),
    toggleBlock: (blockType: BlockType) =>
      doTx((s) => formatCommands.toggleBlockType(s, blockType)),
    toggleBlockAlignment: (alignment: Alignment) =>
      doTx((s) => formatCommands.toggleAlignment(s, alignment)),

    indent: () => doTx((s) => listCommands.indent(s)),
    outdent: () => doTx((s) => listCommands.outdent(s)),
    toggleCheckbox: (nodeId: string) =>
      doTx((s) => listCommands.toggleCheckbox(s, nodeId)),

    resetFormatting: (nodeId: string) =>
      doTx((s) => formatCommands.resetFormatting(s, nodeId)),
    deleteNode: (nodeId: string) =>
      doTx((s) => deleteCommands.deleteNode(s, nodeId)),
    duplicateNode: (nodeId: string) =>
      doTx((s) => formatCommands.duplicateNode(s, nodeId)),
    insertNodeAfter: (nodeId: string) =>
      doTx((s) => formatCommands.insertNodeAfter(s, nodeId)),
    changeNodeType: (nodeId: string, blockType: BlockType) =>
      doTx((s) => formatCommands.changeNodeType(s, nodeId, blockType)),
  };
}
