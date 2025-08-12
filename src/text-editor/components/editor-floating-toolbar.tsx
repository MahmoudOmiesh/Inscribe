import { FloatingToolbar } from "@/components/floating-toolbar";
import type { useEditorActions } from "../hooks/use-editor-actions";
import {
  ALIGNMENT_TYPES,
  BLOCK_TYPES,
  type ActiveMarkDescriptor,
  type Alignment,
  type BlockType,
  type HighlightColor,
  HIGHLIGHT_COLORS_CSS,
  HIGHLIGHT_COLORS,
} from "../model/schema";
import { useMemo, type ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ChevronDownIcon,
  CodeIcon,
  ItalicIcon,
  UnderlineIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ListIcon,
  ListOrderedIcon,
  CheckIcon,
  TypeIcon,
  MoreVerticalIcon,
  StrikethroughIcon,
  SuperscriptIcon,
  SubscriptIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignRightIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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
          <FloatingToolbarToggle
            operation={() => actions.toggleMark({ type: "bold" })}
            isActive={active.marks.some((m) => m.type === "bold")}
            tooltip="Bold"
          >
            <BoldIcon />
          </FloatingToolbarToggle>
          <FloatingToolbarToggle
            operation={() => actions.toggleMark({ type: "italic" })}
            isActive={active.marks.some((m) => m.type === "italic")}
            tooltip="Italic"
          >
            <ItalicIcon />
          </FloatingToolbarToggle>
          <FloatingToolbarToggle
            operation={() => actions.toggleMark({ type: "underline" })}
            isActive={active.marks.some((m) => m.type === "underline")}
            tooltip="Underline"
          >
            <UnderlineIcon />
          </FloatingToolbarToggle>
          <FloatingToolbarToggle
            operation={() => actions.toggleMark({ type: "code" })}
            isActive={active.marks.some((m) => m.type === "code")}
            tooltip="Code"
          >
            <CodeIcon />
          </FloatingToolbarToggle>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {renderHighlightColor(activeHighlightColor)}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-xs">
              Highlight Color
            </DropdownMenuLabel>
            <div className="flex items-center gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <DropdownMenuItem
                  key={color}
                  variant={
                    activeHighlightColor === color ? "primary" : "default"
                  }
                  onClick={() =>
                    actions.toggleMark({ type: "highlight", color })
                  }
                >
                  {renderHighlightColor(color)}
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            className="bg-background flex items-center gap-2 px-1 py-px"
          >
            <div className="flex items-center gap-1">
              <DropdownMenuItem asChild>
                <FloatingToolbarToggle
                  operation={() =>
                    actions.toggleMark({ type: "strikethrough" })
                  }
                  isActive={active.marks.some(
                    (m) => m.type === "strikethrough",
                  )}
                  tooltip="Strikethrough"
                >
                  <StrikethroughIcon />
                </FloatingToolbarToggle>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <FloatingToolbarToggle
                  operation={() => actions.toggleMark({ type: "superscript" })}
                  isActive={active.marks.some((m) => m.type === "superscript")}
                  tooltip="Superscript"
                >
                  <SuperscriptIcon />
                </FloatingToolbarToggle>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <FloatingToolbarToggle
                  operation={() => actions.toggleMark({ type: "subscript" })}
                  isActive={active.marks.some((m) => m.type === "subscript")}
                  tooltip="Subscript"
                >
                  <SubscriptIcon />
                </FloatingToolbarToggle>
              </DropdownMenuItem>
            </div>

            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />

            <div className="flex items-center gap-1">
              {ALIGNMENT_TYPES.map((alignment) => (
                <DropdownMenuItem key={alignment} asChild>
                  <FloatingToolbarToggle
                    operation={() => actions.toggleBlockAlignment(alignment)}
                    isActive={active.align === alignment}
                    tooltip={renderAlignmentLabel(alignment)}
                  >
                    {renderAlignmentIcon(alignment)}
                  </FloatingToolbarToggle>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </FloatingToolbar>
  );
}

function FloatingToolbarToolTip({
  children,
  tooltip,
}: {
  children: ReactNode;
  tooltip: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function FloatingToolbarToggle({
  operation,
  isActive,
  tooltip,
  children,
}: {
  operation: () => void;
  isActive: boolean;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <FloatingToolbarToolTip tooltip={tooltip}>
      <Button
        variant={isActive ? "default" : "ghost"}
        size="icon"
        className="cursor-pointer rounded-sm"
        onClick={operation}
      >
        {children}
      </Button>
    </FloatingToolbarToolTip>
  );
}

function renderBlockLabel(block: BlockType) {
  switch (block) {
    case "heading-1":
      return "Heading 1";
    case "heading-2":
      return "Heading 2";
    case "heading-3":
      return "Heading 3";
    case "heading-4":
      return "Heading 4";
    case "paragraph":
      return "Paragraph";
    case "unordered-list-item":
      return "Bulleted List";
    case "ordered-list-item":
      return "Numbered List";
    case "check-list-item":
      return "To-do List";
    default:
      const _: never = block;
      return _;
  }
}

function renderBlockIcon(block: BlockType) {
  switch (block) {
    case "heading-1":
      return <Heading1Icon />;
    case "heading-2":
      return <Heading2Icon />;
    case "heading-3":
      return <Heading3Icon />;
    case "heading-4":
      return <Heading4Icon />;
    case "paragraph":
      return <TypeIcon />;
    case "unordered-list-item":
      return <ListIcon />;
    case "ordered-list-item":
      return <ListOrderedIcon />;
    case "check-list-item":
      return <CheckIcon />;
    default:
      const _: never = block;
      return _;
  }
}

function renderAlignmentLabel(alignment: Alignment) {
  switch (alignment) {
    case "left":
      return "Left";
    case "center":
      return "Center";
    case "right":
      return "Right";
    case "justify":
      return "Justify";
    default:
      const _: never = alignment;
      return _;
  }
}

function renderAlignmentIcon(alignment: Alignment) {
  switch (alignment) {
    case "left":
      return <AlignLeftIcon />;
    case "center":
      return <AlignCenterIcon />;
    case "right":
      return <AlignRightIcon />;
    case "justify":
      return <AlignJustifyIcon />;
    default:
      const _: never = alignment;
      return _;
  }
}

function renderHighlightColor(color: HighlightColor | null) {
  switch (color) {
    case "red":
      return (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: HIGHLIGHT_COLORS_CSS[color] }}
        />
      );
    case "yellow":
      return (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: HIGHLIGHT_COLORS_CSS[color] }}
        />
      );
    case "green":
      return (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: HIGHLIGHT_COLORS_CSS[color] }}
        />
      );
    case "blue":
      return (
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: HIGHLIGHT_COLORS_CSS[color] }}
        />
      );
    default:
      return <div className="size-4 rounded-full border" />;
  }
}
