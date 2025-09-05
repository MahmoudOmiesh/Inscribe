"use client";

import { useEditor } from "@/text-editor/hooks/use-editor";
import { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import { TextEditor } from "@/text-editor/text-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NotebookPenIcon, Redo2Icon, Undo2Icon } from "lucide-react";
import type { EditorNode } from "@/text-editor/model/schema";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { useIsMobile } from "@/hooks/use-mobile";

export const LANDING_NODES: EditorNode[] = [
  {
    id: "n1",
    type: "heading-1",
    text: "Meet the Inscribe editor ✨️",
    alignment: "left",
    marks: [],
  },
  {
    id: "n2",
    type: "paragraph",
    text: "You can try out the editor here .. 📝 ",
    alignment: "left",
    marks: [],
  },
  {
    id: "n3",
    type: "paragraph",
    text: "Type / to open the command menu and discover the different types of blocks.",
    alignment: "left",
    marks: [
      {
        type: "code",
        start: 5,
        end: 6,
      },
    ],
  },
  {
    id: "n4",
    type: "separator",
    text: "",
    alignment: "left",
    marks: [],
  },
  {
    id: "n5",
    type: "heading-2",
    text: "Choose your look",
    alignment: "left",
    marks: [],
  },
  {
    id: "n6",
    type: "unordered-list-item",
    listId: "l1",
    indentLevel: 0,
    text: "Select text to reveal a floating toolbar:\nYou can italicize, highlight, underline and much more...",
    marks: [
      {
        type: "bold",
        start: 0,
        end: 11,
      },
      {
        type: "italic",
        start: 50,
        end: 59,
      },
      {
        type: "underline",
        start: 72,
        end: 81,
      },
      {
        type: "highlight",
        color: "red",
        start: 61,
        end: 70,
      },
    ],
    alignment: "left",
  },
  {
    id: "n7",
    type: "unordered-list-item",
    listId: "l1",
    indentLevel: 0,
    text: "Hover near any block to reveal the context handle ⠿\nclick to open the context menu (delete, duplicate, reset formatting and more)",
    marks: [
      {
        type: "code",
        start: 50,
        end: 52,
      },
      {
        type: "bold",
        start: 0,
        end: 20,
      },
    ],
    alignment: "left",
  },
  {
    id: "n8",
    type: "unordered-list-item",
    listId: "l1",
    indentLevel: 0,
    text: "Add some fun with emojis : 🥳 ",
    marks: [
      {
        type: "code",
        start: 25,
        end: 26,
      },
    ],
    alignment: "left",
  },
  {
    id: "n9",
    type: "blockquote",
    text: "Need some assistance? ✨️ \nsummon the AI Assistant from the context menu\nask for rewrites, content ideas, step‑by‑step instructions, or quick fact checks",
    marks: [
      {
        type: "bold",
        start: 0,
        end: 21,
      },
      {
        type: "bold",
        start: 25,
        end: 26,
      },
    ],
    alignment: "left",
  },
  {
    id: "n10",
    type: "separator",
    text: "",
    marks: [],
    alignment: "left",
  },
  {
    id: "n11",
    type: "heading-3",
    text: "Checklist:",
    alignment: "left",
    marks: [],
  },
  {
    id: "n12",
    type: "check-list-item",
    listId: "l2",
    indentLevel: 0,
    checked: true,
    text: "Try bold/italic/underline",
    alignment: "left",
    marks: [
      {
        type: "bold",
        start: 4,
        end: 8,
      },
      {
        type: "italic",
        start: 9,
        end: 15,
      },
      {
        type: "underline",
        start: 16,
        end: 25,
      },
    ],
  },
  {
    id: "n13",
    type: "check-list-item",
    listId: "l2",
    indentLevel: 1,
    checked: false,
    text: "Play with lists and indent",
    alignment: "left",
    marks: [],
  },
  {
    id: "n14",
    type: "check-list-item",
    listId: "l2",
    indentLevel: 0,
    checked: false,
    text: "Try a slash command",
    alignment: "left",
    marks: [],
  },
  {
    id: "n15",
    type: "check-list-item",
    listId: "l2",
    indentLevel: 0,
    checked: false,
    text: "Use the floating toolbar",
    alignment: "left",
    marks: [],
  },
  {
    id: "n16",
    type: "check-list-item",
    listId: "l2",
    indentLevel: 0,
    checked: false,
    text: "Explore the context menu",
    alignment: "left",
    marks: [],
  },
  {
    id: "n17",
    type: "check-list-item",
    listId: "l2",
    indentLevel: 0,
    checked: false,
    text: "Ask the AI for help",
    alignment: "left",
    marks: [],
  },
  {
    id: "n18",
    type: "separator",
    text: "",
    marks: [],
    alignment: "left",
  },
  {
    id: "n19",
    type: "paragraph",
    text: "Now it’s your turn — edit anything you see! 🤯",
    alignment: "left",
    marks: [],
  },
];

export function Editor() {
  const isMobile = useIsMobile();
  const editor = useEditor(LANDING_NODES);
  const actions = useEditorActions(
    editor.getState,
    editor.dispatch,
    editor.preserveTypingMarksAtCurrentPosition,
  );

  return (
    <div className="isolate -mt-16 md:-mt-24">
      <MaxWidthWrapper className="relative h-[600px] max-w-5xl rounded-xl">
        <div className="from-primary/50 absolute inset-1.5 hidden rounded-xl bg-gradient-to-b to-transparent blur-lg lg:block"></div>
        <div className="bg-card relative z-10 h-full rounded-[calc(var(--radius)+4px-var(--spacing))] border">
          <div className="flex items-center justify-between border-b px-5 py-1">
            <div className="flex items-center gap-2">
              <NotebookPenIcon className="text-muted-foreground size-4" />
              <span className="text-sm font-medium">New Note</span>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.undo()}
                disabled={!editor.canUndo}
              >
                <Undo2Icon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.redo()}
                disabled={!editor.canRedo}
              >
                <Redo2Icon />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[530px] overflow-hidden">
            <div className="mx-auto max-w-3xl p-1 py-6 sm:p-2 sm:py-8">
              <TextEditor
                editor={editor}
                actions={actions}
                options={{
                  smallText: isMobile,
                }}
              />
            </div>
          </ScrollArea>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
