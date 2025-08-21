import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export function EditorAIPrompt({
  nodeId,
  actions,
  closeAiPrompt,
}: {
  nodeId: string;
  actions: ReturnType<typeof useEditorActions>;
  closeAiPrompt: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="bg-background focus-within:border-primary grid gap-2 overflow-hidden rounded-md border p-2 shadow-md">
      <Textarea
        rows={1}
        className="min-h-fit resize-none rounded-none border-none p-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
        placeholder="Ask AI anything..."
        ref={textareaRef}
      />
      <Button variant="outline" size="icon" className="justify-self-end">
        <ArrowUpIcon />
      </Button>
    </div>
  );
}
