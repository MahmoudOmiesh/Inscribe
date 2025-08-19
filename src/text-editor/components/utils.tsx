import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  CheckIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ListIcon,
  ListOrderedIcon,
  TypeIcon,
} from "lucide-react";
import {
  type Alignment,
  type BlockType,
  type HighlightColor,
} from "../model/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function renderBlockLabel(block: BlockType) {
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

export function renderBlockIcon(block: BlockType) {
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

export function alignmentToCss(alignment: Alignment) {
  switch (alignment) {
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      const _: never = alignment;
      return _;
  }
}

export function renderAlignmentLabel(alignment: Alignment) {
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

export function renderAlignmentIcon(alignment: Alignment) {
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

const HIGHLIGHT_COLORS_CSS_LOCAL = {
  red: "rgb(244 67 54)",
  yellow: "rgb(255 193 7)",
  green: "rgb(76 175 80)",
  blue: "rgb(33 150 243)",
  pink: "rgb(255 205 210)",
  purple: "rgb(224 195 252)",
  orange: "rgb(255 213 181)",
  brown: "rgb(239 235 233)",
  gray: "rgb(245 245 245)",
} as const;

export function renderHighlightColor(color: HighlightColor | null) {
  if (!color) return <div className="size-4 rounded-full border" />;

  return (
    <div
      className="size-4 rounded-full"
      style={{ backgroundColor: HIGHLIGHT_COLORS_CSS_LOCAL[color] }}
    />
  );
}

export function renderHighlightLabel(color: HighlightColor) {
  switch (color) {
    case "red":
      return "Red Background";
    case "yellow":
      return "Yellow Background";
    case "green":
      return "Green Background";
    case "blue":
      return "Blue Background";
    case "pink":
      return "Pink Background";
    case "purple":
      return "Purple Background";
    case "orange":
      return "Orange Background";
    case "brown":
      return "Brown Background";
    default:
      const _: never = color;
      return _;
  }
}

export function EditorTooltip({
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

export function EditorToggle({
  operation,
  isActive,
  tooltip,
  children,
  ...props
}: {
  operation: () => void;
  isActive: boolean;
  tooltip: string;
  children: ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <EditorTooltip tooltip={tooltip}>
      <Button
        variant={isActive ? "default" : "ghost"}
        size="icon"
        className="cursor-pointer rounded-sm"
        onClick={operation}
        {...props}
      >
        {children}
      </Button>
    </EditorTooltip>
  );
}
