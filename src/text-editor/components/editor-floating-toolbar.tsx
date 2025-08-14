import { FloatingToolbar } from "@/components/floating-toolbar";
import type { useEditorActions } from "../hooks/use-editor-actions";
import {
  ALIGNMENT_TYPES,
  BLOCK_TYPES,
  type ActiveMarkDescriptor,
  type Alignment,
  type BlockType,
  HIGHLIGHT_COLORS,
} from "../model/schema";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  ItalicIcon,
  UnderlineIcon,
  MoreVerticalIcon,
  StrikethroughIcon,
  SuperscriptIcon,
  SubscriptIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  EditorToggle,
  EditorTooltip,
  renderAlignmentIcon,
  renderAlignmentLabel,
  renderBlockIcon,
  renderBlockLabel,
  renderHighlightColor,
  renderHighlightLabel,
} from "./utils";
import {
  Popover,
  PopoverContent,
  PopoverGroup,
  PopoverItem,
  PopoverLabel,
  PopoverTrigger,
} from "@/components/ui/popover";

export function EditorFloatingToolbar({
  editorRef,
  actions,
  active,
}: {
  editorRef: React.RefObject<HTMLDivElement | null>;
  actions: ReturnType<typeof useEditorActions>;
  active: {
    marks: ActiveMarkDescriptor[];
    block: BlockType | null;
    align: Alignment | null;
  };
}) {
  const activeHighlightColor = useMemo(() => {
    return active.marks.find((m) => m.type === "highlight")?.color ?? null;
  }, [active.marks]);

  return (
    <FloatingToolbar containerRef={editorRef}>
      <div className="bg-background flex items-center gap-2 rounded-sm border px-1 py-px">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              {active.block && renderBlockLabel(active.block)}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={6}
            className="bg-background w-fit p-1"
          >
            <PopoverLabel>Turn Into</PopoverLabel>
            <PopoverGroup>
              {BLOCK_TYPES.map((block) => (
                <PopoverItem
                  key={block}
                  variant={active.block === block ? "default" : "ghost"}
                  onClick={() => actions.toggleBlock(block)}
                >
                  {renderBlockIcon(block)}
                  <span className="text-sm">{renderBlockLabel(block)}</span>
                </PopoverItem>
              ))}
            </PopoverGroup>
          </PopoverContent>
        </Popover>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <div className="flex items-center gap-1">
          <EditorToggle
            operation={() => actions.toggleMark({ type: "bold" })}
            isActive={active.marks.some((m) => m.type === "bold")}
            tooltip="Bold"
          >
            <BoldIcon />
          </EditorToggle>
          <EditorToggle
            operation={() => actions.toggleMark({ type: "italic" })}
            isActive={active.marks.some((m) => m.type === "italic")}
            tooltip="Italic"
          >
            <ItalicIcon />
          </EditorToggle>
          <EditorToggle
            operation={() => actions.toggleMark({ type: "underline" })}
            isActive={active.marks.some((m) => m.type === "underline")}
            tooltip="Underline"
          >
            <UnderlineIcon />
          </EditorToggle>
          <EditorToggle
            operation={() => actions.toggleMark({ type: "code" })}
            isActive={active.marks.some((m) => m.type === "code")}
            tooltip="Code"
          >
            <CodeIcon />
          </EditorToggle>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <Popover>
          <EditorTooltip tooltip="Highlight">
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                {renderHighlightColor(activeHighlightColor)}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
          </EditorTooltip>
          <PopoverContent
            align="center"
            sideOffset={8}
            className="bg-background w-fit p-1"
          >
            <PopoverLabel>Highlight Color</PopoverLabel>
            <PopoverGroup className="grid grid-cols-4 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <EditorToggle
                  key={color}
                  operation={() =>
                    actions.toggleMark({ type: "highlight", color })
                  }
                  isActive={activeHighlightColor === color}
                  tooltip={renderHighlightLabel(color)}
                >
                  {renderHighlightColor(color)}
                </EditorToggle>
              ))}
            </PopoverGroup>
          </PopoverContent>
        </Popover>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            side="top"
            className="bg-background flex w-fit items-center gap-2 px-1 py-px"
          >
            <PopoverGroup className="flex-row items-center gap-1">
              <EditorToggle
                operation={() => actions.toggleMark({ type: "strikethrough" })}
                isActive={active.marks.some((m) => m.type === "strikethrough")}
                tooltip="Strikethrough"
              >
                <StrikethroughIcon />
              </EditorToggle>
              <EditorToggle
                operation={() => actions.toggleMark({ type: "superscript" })}
                isActive={active.marks.some((m) => m.type === "superscript")}
                tooltip="Superscript"
              >
                <SuperscriptIcon />
              </EditorToggle>
              <EditorToggle
                operation={() => actions.toggleMark({ type: "subscript" })}
                isActive={active.marks.some((m) => m.type === "subscript")}
                tooltip="Subscript"
              >
                <SubscriptIcon />
              </EditorToggle>
            </PopoverGroup>

            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />

            <PopoverGroup className="flex-row items-center gap-1">
              {ALIGNMENT_TYPES.map((alignment) => (
                <EditorToggle
                  key={alignment}
                  operation={() => actions.toggleBlockAlignment(alignment)}
                  isActive={active.align === alignment}
                  tooltip={renderAlignmentLabel(alignment)}
                >
                  {renderAlignmentIcon(alignment)}
                </EditorToggle>
              ))}
            </PopoverGroup>
          </PopoverContent>
        </Popover>
      </div>
    </FloatingToolbar>
  );
}
