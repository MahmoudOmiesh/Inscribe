import { useCallback, useEffect, type ReactNode, type RefObject } from "react";
import type { useEditorOperations } from "../hooks/use-editor-operations";

interface EditorInputHandlerProps {
  children: ReactNode;
  operations: ReturnType<typeof useEditorOperations>;
  editorRef: RefObject<HTMLDivElement | null>;
}

export function EditorInputHandler({
  children,
  operations,
  editorRef,
}: EditorInputHandlerProps) {
  const handleBeforeInput = useCallback(
    (e: InputEvent) => {
      const { inputType, data, dataTransfer } = e;
      console.log("INPUT", inputType, data);

      e.preventDefault();

      switch (inputType) {
        case "insertText": {
          operations.insertText(data ?? "");
          break;
        }
        case "insertReplacementText": {
          const replacementText = dataTransfer?.getData("text/plain") ?? "";
          operations.insertText(replacementText);
          break;
        }
        case "insertParagraph": {
          operations.insertParagraph();
          break;
        }
        case "insertLineBreak": {
          operations.insertText("\n");
          break;
        }

        case "deleteContentBackward": {
          operations.deleteTextBackward();
          break;
        }
        case "deleteContentForward": {
          operations.deleteTextForward();
          break;
        }
        case "deleteWordBackward": {
          operations.deleteWordBackward();
          break;
        }
        case "deleteWordForward": {
          operations.deleteWordForward();
          break;
        }

        case "deleteByCut": {
          operations.deleteByCut();
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

          operations.pasteText(content, contentType);
          break;
        }

        case "historyUndo": {
          operations.undo();
          break;
        }
        case "historyRedo": {
          operations.redo();
          break;
        }

        case "formatBold": {
          operations.toggleMark("bold");
          break;
        }
        case "formatItalic": {
          operations.toggleMark("italic");
          break;
        }
        case "formatUnderline": {
          operations.toggleMark("underline");
          break;
        }
        case "formatStrikethrough": {
          operations.toggleMark("strikethrough");
          break;
        }
        case "formatSuperscript": {
          operations.toggleMark("superscript");
          break;
        }
        case "formatSubscript": {
          operations.toggleMark("subscript");
          break;
        }
      }
    },
    [operations],
  );

  useEffect(() => {
    // on before input is added with an event listener
    // rather than with onBeforeInput prop
    // because react nativeEvent doesn't contain
    // the event data that comes with the event
    // natively in the browser
    const editor = editorRef.current;
    if (!editor) return;

    editor.addEventListener("beforeinput", handleBeforeInput);
    return () => {
      editor.removeEventListener("beforeinput", handleBeforeInput);
    };
  }, [handleBeforeInput, editorRef]);

  return children;
}
