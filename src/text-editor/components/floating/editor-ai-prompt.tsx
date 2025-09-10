import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { useEditorActions } from "@/text-editor/hooks/use-editor-actions";
import { ArrowUpIcon, CheckIcon, CircleStopIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { LoadingDots } from "@/components/loading-dots";
import { cn } from "@/lib/utils";
import type { Mark } from "@/text-editor/model/schema";

export function EditorAIPrompt({
  nodeId,
  nodeText,
  nodeMarks,
  actions,
  closeAiPrompt,
}: {
  nodeId: string;
  nodeText: string;
  nodeMarks: Mark[];
  actions: ReturnType<typeof useEditorActions>;
  closeAiPrompt: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const { messages, sendMessage, status, stop, setMessages } = useChat();

  const isPending = status !== "ready";
  const isFinished = !isPending && messages.length > 0;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const originalText = useRef(nodeText);
  const originalMarks = useRef(nodeMarks);

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, []);

  function onStop() {
    void stop();
    setMessages([]);
    closeAiPrompt();
  }

  function onAccept() {
    actions.setRange({
      nodeId,
      offset: nodeText.length,
    });
    closeAiPrompt();
  }

  function onDiscard() {
    actions.streamText(nodeId, originalText.current, originalMarks.current);
    closeAiPrompt();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (prompt.length === 0) return;

    const text = isFinished ? prompt : prompt + "\n" + nodeText;

    void sendMessage({
      text,
    });
    setPrompt("");
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== "assistant") return;

    const text = lastMessage.parts.reduce((acc, part) => {
      if (part.type === "text") {
        return acc + part.text;
      }
      return acc;
    }, "");

    actions.streamText(nodeId, text);
  }, [actions, messages, nodeId]);

  return (
    <div className="bg-background focus-within:border-primary overflow-hidden rounded-md border shadow-md">
      {isPending ? (
        <div className="flex items-center justify-between p-2">
          <div className="flex items-baseline gap-2">
            <p className="text-primary text-sm font-semibold">AI is thinking</p>
            <LoadingDots />
          </div>
          <Button variant="outline" size="icon" onClick={onStop}>
            <CircleStopIcon />
          </Button>
        </div>
      ) : (
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className={cn(
            "grid gap-2 p-2",
            isFinished && "rounded-b-md border-b",
          )}
        >
          <Textarea
            rows={1}
            className="min-h-fit resize-none rounded-none border-none p-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
            placeholder={
              isFinished ? "Ask AI to continue..." : "Ask AI anything..."
            }
            ref={textareaRef}
            value={prompt}
            onBeforeInput={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => {
              e.stopPropagation();
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            className="justify-self-end"
            type="submit"
            disabled={prompt.length === 0}
          >
            <ArrowUpIcon />
          </Button>
        </form>
      )}
      {isFinished && (
        <div className="mt-1 flex justify-end p-2">
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={onDiscard}>
              <XIcon />
              Discard
            </Button>
            <Button variant="default" size="sm" onClick={onAccept}>
              <CheckIcon />
              Accept
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
