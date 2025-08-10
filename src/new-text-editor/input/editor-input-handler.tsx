import { useCallback, useEffect, type ReactNode, type RefObject } from "react";
import type { EditorState } from "../state/editor-state";
import type { Dispatch, Transaction } from "../state/transaction";
import { deleteCommands, formatCommands, textCommands } from "../commands";
import { handleKeyDown } from "./keymap";

interface EditorInputHandlerProps {
  children: ReactNode;
  editorRef: RefObject<HTMLDivElement | null>;
  getState: () => EditorState;
  dispatch: Dispatch;
}

export function EditorInputHandler({
  children,
  editorRef,
  getState,
  dispatch,
}: EditorInputHandlerProps) {
  const onBeforeInput = useCallback(
    (e: InputEvent) => {
      const state = getState();
      const { inputType, data, dataTransfer } = e;
      let tx: Transaction | null = null;

      e.preventDefault();
      switch (inputType) {
        case "insertText": {
          tx = textCommands.insertText(state, data ?? "");
          break;
        }
        case "insertReplacementText": {
          const replacementText = dataTransfer?.getData("text/plain") ?? "";
          tx = textCommands.insertText(state, replacementText);
          break;
        }
        case "insertParagraph": {
          tx = textCommands.insertParagraph(state);
          break;
        }
        case "insertLineBreak": {
          tx = textCommands.insertText(state, "\n");
          break;
        }

        case "deleteContentBackward": {
          tx = deleteCommands.deleteBackward(state);
          break;
        }
        case "deleteContentForward": {
          tx = deleteCommands.deleteForward(state);
          break;
        }
        case "deleteWordBackward": {
          tx = deleteCommands.deleteWordBackward(state);
          break;
        }
        case "deleteWordForward": {
          tx = deleteCommands.deleteWordForward(state);
          break;
        }
        case "deleteByCut": {
          tx = deleteCommands.deleteBackward(state);
          break;
        }

        case "insertFromPaste": {
          if (!dataTransfer) return;
          const contentType = dataTransfer.types.includes("text/html")
            ? "html"
            : "plain";
          const content = dataTransfer.getData(
            contentType === "html" ? "text/html" : "text/plain",
          );

          tx = textCommands.paste(state, content, contentType);
          break;
        }

        case "formatBold": {
          tx = formatCommands.toggleMark(state, { type: "bold" });
          break;
        }
        case "formatItalic": {
          tx = formatCommands.toggleMark(state, { type: "italic" });
          break;
        }
        case "formatUnderline": {
          tx = formatCommands.toggleMark(state, { type: "underline" });
          break;
        }
        case "formatStrikethrough": {
          tx = formatCommands.toggleMark(state, { type: "strikethrough" });
          break;
        }
        case "formatSuperscript": {
          tx = formatCommands.toggleMark(state, { type: "superscript" });
          break;
        }
        case "formatSubscript": {
          tx = formatCommands.toggleMark(state, { type: "subscript" });
          break;
        }
        case "formatJustifyLeft": {
          tx = formatCommands.toggleAlignment(state, "left");
          break;
        }
        case "formatJustifyCenter": {
          tx = formatCommands.toggleAlignment(state, "center");
          break;
        }
        case "formatJustifyRight": {
          tx = formatCommands.toggleAlignment(state, "right");
          break;
        }
        case "formatJustifyFull": {
          tx = formatCommands.toggleAlignment(state, "justify");
          break;
        }
      }

      if (tx) dispatch(tx);
    },
    [getState, dispatch],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      handleKeyDown(e, getState(), dispatch);
    },
    [getState, dispatch],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.addEventListener("beforeinput", onBeforeInput);
    editor.addEventListener("keydown", onKeyDown);
    return () => {
      editor.removeEventListener("beforeinput", onBeforeInput);
      editor.removeEventListener("keydown", onKeyDown);
    };
  }, [onBeforeInput, onKeyDown, editorRef]);

  return children;
}
