import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { handleKeyDown } from "./keymap";
import type { useEditorActions } from "../hooks/use-editor-actions";
import { CommandMenu } from "../components/menu/command-menu";
import { EmojiMenu } from "../components/menu/emoji-menu";

interface EditorInputHandlerProps {
  children: ReactNode;
  editorRef: RefObject<HTMLDivElement | null>;
  actions: ReturnType<typeof useEditorActions>;
}

export function EditorInputHandler({
  children,
  actions,
  editorRef,
}: EditorInputHandlerProps) {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);

  const onBeforeInput = useCallback(
    (e: InputEvent) => {
      const { inputType, data, dataTransfer } = e;
      e.preventDefault();

      switch (inputType) {
        case "insertText": {
          actions.insertText(data ?? "");

          if (data === "/") {
            setIsCommandMenuOpen(true);
          }
          if (data === ":") {
            setIsEmojiMenuOpen(true);
          }

          break;
        }
        case "insertReplacementText": {
          const replacementText = dataTransfer?.getData("text/plain") ?? "";
          actions.insertText(replacementText);
          break;
        }
        case "insertParagraph": {
          actions.insertParagraph();
          break;
        }
        case "insertLineBreak": {
          actions.insertText("\n");
          break;
        }

        case "deleteContentBackward": {
          actions.deleteBackward();
          break;
        }
        case "deleteContentForward": {
          actions.deleteForward();
          break;
        }
        case "deleteWordBackward": {
          actions.deleteWordBackward();
          break;
        }
        case "deleteWordForward": {
          actions.deleteWordForward();
          break;
        }
        case "deleteByCut": {
          actions.deleteBackward();
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

          actions.paste(content, contentType);
          break;
        }

        case "formatBold": {
          actions.toggleMark({ type: "bold" });
          break;
        }
        case "formatItalic": {
          actions.toggleMark({ type: "italic" });
          break;
        }
        case "formatUnderline": {
          actions.toggleMark({ type: "underline" });
          break;
        }
        case "formatStrikethrough": {
          actions.toggleMark({ type: "strikethrough" });
          break;
        }
        case "formatSuperscript": {
          actions.toggleMark({ type: "superscript" });
          break;
        }
        case "formatSubscript": {
          actions.toggleMark({ type: "subscript" });
          break;
        }
        case "formatJustifyLeft": {
          actions.toggleBlockAlignment("left");
          break;
        }
        case "formatJustifyCenter": {
          actions.toggleBlockAlignment("center");
          break;
        }
        case "formatJustifyRight": {
          actions.toggleBlockAlignment("right");
          break;
        }
        case "formatJustifyFull": {
          actions.toggleBlockAlignment("justify");
          break;
        }
      }
    },
    [actions],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      handleKeyDown(e, actions);
    },
    [actions],
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

  return (
    <>
      {children}
      {isCommandMenuOpen && (
        <CommandMenu
          isOpen={isCommandMenuOpen}
          setIsOpen={setIsCommandMenuOpen}
          actions={actions}
        />
      )}
      {isEmojiMenuOpen && (
        <EmojiMenu
          isOpen={isEmojiMenuOpen}
          setIsOpen={setIsEmojiMenuOpen}
          actions={actions}
        />
      )}
    </>
  );
}
