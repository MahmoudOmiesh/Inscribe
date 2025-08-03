import { Button } from "@/components/ui/button";
import type { useEditor } from "../hooks/use-editor";
import type { useEditorOperations } from "../hooks/use-editor-operations";
import type { ReactNode } from "react";

type Operations = ReturnType<typeof useEditorOperations>;
type Operation = Operations[keyof Operations];

export function EditorToolbar({
  editor,
  operations,
}: {
  editor: ReturnType<typeof useEditor>;
  operations: ReturnType<typeof useEditorOperations>;
}) {
  return <div>EditorToolbar</div>;
}

function EditorToolbarButton({
  operation,
  isDisabled,
  children,
}: {
  operation: Operation;
  isDisabled: boolean;
  children: ReactNode;
}) {
  return (
    <Button disabled={isDisabled} onClick={operation}>
      {children}
    </Button>
  );
}
