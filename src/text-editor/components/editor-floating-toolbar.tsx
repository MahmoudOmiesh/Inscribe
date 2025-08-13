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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {active.block && renderBlockLabel(active.block)}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-xs">Turn Into</DropdownMenuLabel>
            {BLOCK_TYPES.map((block) => (
              <DropdownMenuItem
                key={block}
                variant={active.block === block ? "primary" : "default"}
                onClick={() => actions.toggleBlock(block)}
              >
                {renderBlockIcon(block)}
                <span className="text-sm">{renderBlockLabel(block)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

        <DropdownMenu>
          <EditorTooltip tooltip="Highlight">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {renderHighlightColor(activeHighlightColor)}
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
          </EditorTooltip>
          <DropdownMenuContent
            align="center"
            sideOffset={8}
            className="bg-background"
          >
            <DropdownMenuLabel className="text-xs">
              Highlight Color
            </DropdownMenuLabel>
            <div className="grid grid-cols-4 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <DropdownMenuItem key={color} asChild>
                  <EditorToggle
                    operation={() =>
                      actions.toggleMark({ type: "highlight", color })
                    }
                    isActive={activeHighlightColor === color}
                    tooltip={renderHighlightLabel(color)}
                  >
                    {renderHighlightColor(color)}
                  </EditorToggle>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <DropdownMenu>
          <EditorTooltip tooltip="More">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
          </EditorTooltip>
          <DropdownMenuContent
            align="center"
            side="top"
            className="bg-background flex items-center gap-2 px-1 py-px"
          >
            <div className="flex items-center gap-1">
              <DropdownMenuItem asChild>
                <EditorToggle
                  operation={() =>
                    actions.toggleMark({ type: "strikethrough" })
                  }
                  isActive={active.marks.some(
                    (m) => m.type === "strikethrough",
                  )}
                  tooltip="Strikethrough"
                >
                  <StrikethroughIcon />
                </EditorToggle>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <EditorToggle
                  operation={() => actions.toggleMark({ type: "superscript" })}
                  isActive={active.marks.some((m) => m.type === "superscript")}
                  tooltip="Superscript"
                >
                  <SuperscriptIcon />
                </EditorToggle>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <EditorToggle
                  operation={() => actions.toggleMark({ type: "subscript" })}
                  isActive={active.marks.some((m) => m.type === "subscript")}
                  tooltip="Subscript"
                >
                  <SubscriptIcon />
                </EditorToggle>
              </DropdownMenuItem>
            </div>

            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />

            <div className="flex items-center gap-1">
              {ALIGNMENT_TYPES.map((alignment) => (
                <DropdownMenuItem key={alignment} asChild>
                  <EditorToggle
                    operation={() => actions.toggleBlockAlignment(alignment)}
                    isActive={active.align === alignment}
                    tooltip={renderAlignmentLabel(alignment)}
                  >
                    {renderAlignmentIcon(alignment)}
                  </EditorToggle>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </FloatingToolbar>
  );
}
