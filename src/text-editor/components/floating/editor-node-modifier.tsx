import { Button } from "@/components/ui/button";
import type { useEditorActions } from "../../hooks/use-editor-actions";
import { TEXT_BLOCK_TYPES, type BlockType } from "../../model/schema";
import {
  ArrowRightLeftIcon,
  ClipboardIcon,
  CopyIcon,
  GripVerticalIcon,
  PlusIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { renderBlockIcon, renderBlockLabel } from "../utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function EditorNodeModifier({
  nodeId,
  actions,
  activeBlock,
  setIsMenuOpen,
  openAiPrompt,
}: {
  nodeId: string;
  activeBlock: BlockType;
  actions: ReturnType<typeof useEditorActions>;
  setIsMenuOpen: (open: boolean) => void;
  openAiPrompt: () => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isSeparator = activeBlock === "separator";

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        isDropdownOpen && "pointer-events-none",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        onClick={() => actions.insertNodeAfter(nodeId)}
      >
        <PlusIcon />
      </Button>
      <DropdownMenu
        modal={false}
        open={isDropdownOpen}
        onOpenChange={(open) => {
          setIsDropdownOpen(open);
          setIsMenuOpen(open);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-6">
            <GripVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          sideOffset={8}
          align="center"
          className="bg-background min-w-[210px] p-1"
        >
          <DropdownMenuLabel className="text-xs">
            {renderBlockLabel(activeBlock)}
          </DropdownMenuLabel>
          {!isSeparator && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowRightLeftIcon className="text-muted-foreground size-4" />{" "}
                    Turn Into
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-background space-y-1">
                    <DropdownMenuLabel className="text-xs">
                      Turn Into
                    </DropdownMenuLabel>
                    {TEXT_BLOCK_TYPES.map((type) => (
                      <DropdownMenuItem
                        key={type}
                        variant={type === activeBlock ? "primary" : "default"}
                        onClick={() => actions.changeNodeType(nodeId, type)}
                      >
                        {renderBlockIcon(type)}
                        {renderBlockLabel(type)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onClick={() => actions.resetFormatting(nodeId)}
                >
                  <RotateCcwIcon className="text-muted-foreground size-4" />{" "}
                  Reset Formatting
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => actions.duplicateNode(nodeId)}>
              <CopyIcon className="text-muted-foreground size-4" /> Duplicate
              Node
            </DropdownMenuItem>
            {!isSeparator && (
              <DropdownMenuItem>
                <ClipboardIcon className="text-muted-foreground size-4" /> Copy
                to Clipboard
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          {!isSeparator && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    openAiPrompt();
                  }}
                >
                  <SparklesIcon className="text-muted-foreground size-4" /> Ask
                  AI
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive-hover"
              onClick={() => actions.deleteNode(nodeId)}
            >
              <TrashIcon className="text-muted-foreground size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
