import { Button } from "@/components/ui/button";
import type { useEditorActions } from "../hooks/use-editor-actions";
import { BLOCK_TYPES, type BlockType } from "../model/schema";
import {
  ArrowRightLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  CopyIcon,
  GripVerticalIcon,
  PlusIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { renderBlockIcon, renderBlockLabel } from "./utils";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EditorNodeModifier({
  nodeId,
  actions,
  activeBlock,
  onFloatingInteraction,
}: {
  nodeId: string;
  activeBlock: BlockType;
  actions: ReturnType<typeof useEditorActions>;
  onFloatingInteraction: (open: boolean) => void;
}) {
  const [turnIntoOpen, setTurnIntoOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => actions.insertNodeAfter(nodeId)}
      >
        <PlusIcon />
      </Button>
      <Popover onOpenChange={onFloatingInteraction}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <GripVerticalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          align="center"
          className="bg-background w-fit p-1"
        >
          <div className="px-2 py-1.5 text-xs font-medium">
            {renderBlockLabel(activeBlock)}
          </div>
          <ul>
            <li>
              <Popover open={turnIntoOpen} onOpenChange={setTurnIntoOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      turnIntoOpen && "bg-accent dark:bg-accent/50",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onMouseEnter={() => setTurnIntoOpen((o) => !o)}
                  >
                    <span className="flex items-center gap-1">
                      <ArrowRightLeftIcon /> Turn Into
                    </span>
                    <ChevronRightIcon className="ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  align="center"
                  className="bg-background w-fit p-1"
                  sideOffset={8}
                >
                  <div className="px-2 py-1.5 text-xs font-medium">
                    Turn Into
                  </div>
                  <ul>
                    {BLOCK_TYPES.map((type) => (
                      <li key={type}>
                        <Button
                          variant={type === activeBlock ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => actions.changeNodeType(nodeId, type)}
                        >
                          {renderBlockIcon(type)}
                          {renderBlockLabel(type)}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => actions.resetFormatting(nodeId)}
              >
                <RotateCcwIcon /> Reset Formatting
              </Button>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => actions.duplicateNode(nodeId)}
              >
                <CopyIcon /> Duplicate Node
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <ClipboardIcon /> Copy to Clipboard
              </Button>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                size="sm"
                onClick={() => actions.deleteNode(nodeId)}
              >
                <TrashIcon /> Delete
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
