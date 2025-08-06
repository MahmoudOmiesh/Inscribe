import { Button } from "@/components/ui/button";
import type { useEditor } from "../hooks/use-editor";
import type { useEditorOperations } from "../hooks/use-editor-operations";
import type { ReactNode } from "react";
import {
  Heading1Icon,
  Heading4Icon,
  Heading2Icon,
  Heading3Icon,
  Redo,
  Undo,
  Heading,
  ChevronDown,
  List,
  ListOrdered,
  UnderlineIcon,
  ItalicIcon,
  BoldIcon,
  SubscriptIcon,
  SuperscriptIcon,
  StrikethroughIcon,
  Pencil,
  AlignLeftIcon,
  AlignJustifyIcon,
  AlignRightIcon,
  AlignCenterIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ALIGNMENT_TYPES,
  HEADING_TYPES,
  LIST_TYPES,
  MARK_TYPES,
  type EditorNode,
  type HeadingNode,
  type ListItemNode,
  type Mark,
} from "../utils/types";
import { cn } from "@/lib/utils";

type NodeType = EditorNode["type"];
type HeadingType = HeadingNode["type"];
type ListType = ListItemNode["type"];
type MarkType = Mark["type"];
type AlignmentType = EditorNode["alignment"];

export function EditorToolbar({
  editor,
  operations,
}: {
  editor: ReturnType<typeof useEditor>;
  operations: ReturnType<typeof useEditorOperations>;
}) {
  const activeHeading = HEADING_TYPES.includes(
    editor.activeNodeType as HeadingType,
  )
    ? (editor.activeNodeType as HeadingType)
    : null;

  const activeList = LIST_TYPES.includes(editor.activeNodeType as ListType)
    ? (editor.activeNodeType as ListType)
    : null;

  return (
    <div className="flex items-center justify-center gap-2">
      <UndoRedo
        undo={operations.undo}
        redo={operations.redo}
        canUndo={operations.canUndo}
        canRedo={operations.canRedo}
      />

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-5"
      />

      <HeadingDropdown
        activeHeading={activeHeading}
        toggleNodeTypeOperation={operations.toggleNodeType}
      />

      <ListDropdown
        activeList={activeList}
        toggleNodeTypeOperation={operations.toggleNodeType}
      />

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-5"
      />

      <Marks
        activeMarks={editor.activeMarks}
        toggleMarkOperation={operations.toggleMark}
      />

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-5"
      />

      <Alignment
        activeAlignment={editor.activeNodeAlignment}
        toggleAlignmentOperation={operations.toggleNodeAlignment}
      />
    </div>
  );
}

function UndoRedo({
  undo,
  redo,
  canUndo,
  canRedo,
}: {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-1">
      <EditorToolbarButton
        operation={undo}
        isDisabled={!canUndo}
        tooltip="Undo"
      >
        <Undo className="size-4" />
      </EditorToolbarButton>
      <EditorToolbarButton
        operation={redo}
        isDisabled={!canRedo}
        tooltip="Redo"
      >
        <Redo className="size-4" />
      </EditorToolbarButton>
    </div>
  );
}

function HeadingDropdown({
  activeHeading,
  toggleNodeTypeOperation,
}: {
  activeHeading: HeadingType | null;
  toggleNodeTypeOperation: (nodeType: NodeType) => void;
}) {
  return (
    <DropdownMenu>
      <EditorToolTip tooltip="Heading">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative cursor-pointer">
            <HeadingIcon
              headingType={activeHeading}
              className={cn(activeHeading && "text-green-500", "size-4")}
            />
            <ChevronDown className="absolute top-1/2 right-[2px] size-2 -translate-y-1/2" />
          </Button>
        </DropdownMenuTrigger>
      </EditorToolTip>
      <DropdownMenuContent align="start">
        {HEADING_TYPES.map((headingType) => (
          <DropdownMenuItem
            key={headingType}
            onClick={() =>
              toggleNodeTypeOperation(
                activeHeading === headingType ? "paragraph" : headingType,
              )
            }
            className={cn(
              "cursor-pointer",
              activeHeading === headingType && "bg-accent",
            )}
          >
            <HeadingIcon
              headingType={headingType}
              className={cn(
                activeHeading === headingType && "text-green-500",
                "size-4",
              )}
            />
            Heading {Number(headingType.split("-")[1])}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ListDropdown({
  activeList,
  toggleNodeTypeOperation,
}: {
  activeList: ListType | null;
  toggleNodeTypeOperation: (nodeType: NodeType) => void;
}) {
  return (
    <DropdownMenu>
      <EditorToolTip tooltip="List">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative cursor-pointer">
            <ListIcon
              listType={activeList}
              className={cn(activeList && "text-green-500", "size-4")}
            />
            <ChevronDown className="absolute top-1/2 right-[2px] size-2 -translate-y-1/2" />
          </Button>
        </DropdownMenuTrigger>
      </EditorToolTip>
      <DropdownMenuContent align="start">
        {LIST_TYPES.map((listType) => (
          <DropdownMenuItem
            key={listType}
            onClick={() =>
              toggleNodeTypeOperation(
                activeList === listType ? "paragraph" : listType,
              )
            }
            className={cn(
              "cursor-pointer",
              activeList === listType && "bg-accent",
            )}
          >
            <ListIcon
              listType={listType}
              className={cn(
                activeList === listType && "text-green-500",
                "size-4",
              )}
            />
            {getListLabel(listType)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Marks({
  activeMarks,
  toggleMarkOperation,
}: {
  activeMarks: MarkType[];
  toggleMarkOperation: (markType: MarkType) => void;
}) {
  const isActive = (markType: MarkType) => activeMarks.includes(markType);

  return (
    <div className="flex items-center gap-1">
      {MARK_TYPES.map((markType) => (
        <EditorToolbarToggle
          key={markType}
          operation={() => toggleMarkOperation(markType)}
          isActive={isActive(markType)}
          tooltip={getMarkLabel(markType)}
        >
          <MarkIcon
            markType={markType}
            className={cn(isActive(markType) && "text-green-500", "size-4")}
          />
        </EditorToolbarToggle>
      ))}
    </div>
  );
}

function Alignment({
  activeAlignment,
  toggleAlignmentOperation,
}: {
  activeAlignment: AlignmentType | null;
  toggleAlignmentOperation: (alignment: AlignmentType) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {ALIGNMENT_TYPES.map((alignment) => (
        <EditorToolbarToggle
          key={alignment}
          operation={() => toggleAlignmentOperation(alignment)}
          isActive={activeAlignment === alignment}
          tooltip={getAlignmentLabel(alignment)}
        >
          <AlignmentIcon
            alignment={alignment}
            className={cn(
              activeAlignment === alignment && "text-green-500",
              "size-4",
            )}
          />
        </EditorToolbarToggle>
      ))}
    </div>
  );
}

function EditorToolbarButton({
  operation,
  isDisabled,
  tooltip,
  children,
}: {
  operation: () => void;
  isDisabled: boolean;
  tooltip: string;
  children: ReactNode;
}) {
  return (
    <EditorToolTip tooltip={tooltip}>
      <Button
        disabled={isDisabled}
        onClick={operation}
        variant="ghost"
        size="icon"
        className="cursor-pointer"
      >
        {children}
      </Button>
    </EditorToolTip>
  );
}

function EditorToolbarToggle({
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
    <EditorToolTip tooltip={tooltip}>
      <Button
        variant={isActive ? "outline" : "ghost"}
        size="icon"
        className="cursor-pointer"
        onClick={operation}
      >
        {children}
      </Button>
    </EditorToolTip>
  );
}

function EditorToolTip({
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

function HeadingIcon({
  headingType,
  className,
}: {
  headingType: HeadingType | null;
  className?: string;
}) {
  switch (headingType) {
    case "heading-1":
      return <Heading1Icon className={className} />;
    case "heading-2":
      return <Heading2Icon className={className} />;
    case "heading-3":
      return <Heading3Icon className={className} />;
    case "heading-4":
      return <Heading4Icon className={className} />;
    default:
      return <Heading className={className} />;
  }
}

function ListIcon({
  listType,
  className,
}: {
  listType: ListType | null;
  className?: string;
}) {
  switch (listType) {
    case "unordered-list-item":
      return <List className={className} />;
    case "ordered-list-item":
      return <ListOrdered className={className} />;
    default:
      return <List className={className} />;
  }
}

function getListLabel(listType: ListType) {
  switch (listType) {
    case "unordered-list-item":
      return "Bulleted List";
    case "ordered-list-item":
      return "Ordered List";
    default:
      const _exhaustiveCheck: never = listType;
      return _exhaustiveCheck;
  }
}

function MarkIcon({
  markType,
  className,
}: {
  markType: MarkType;
  className?: string;
}) {
  switch (markType) {
    case "bold":
      return <BoldIcon className={className} />;
    case "italic":
      return <ItalicIcon className={className} />;
    case "underline":
      return <UnderlineIcon className={className} />;
    case "strikethrough":
      return <StrikethroughIcon className={className} />;
    case "superscript":
      return <SuperscriptIcon className={className} />;
    case "subscript":
      return <SubscriptIcon className={className} />;
    case "highlight-yellow":
      return <Pencil className={className} />;
    default:
      const _exhaustiveCheck: never = markType;
      return _exhaustiveCheck;
  }
}

function getMarkLabel(markType: MarkType) {
  switch (markType) {
    case "bold":
      return "Bold";
    case "italic":
      return "Italic";
    case "underline":
      return "Underline";
    case "strikethrough":
      return "Strike";
    case "superscript":
      return "Superscript";
    case "subscript":
      return "Subscript";
    case "highlight-yellow":
      return "Highlight";
    default:
      const _exhaustiveCheck: never = markType;
      return _exhaustiveCheck;
  }
}

function AlignmentIcon({
  alignment,
  className,
}: {
  alignment: AlignmentType;
  className?: string;
}) {
  switch (alignment) {
    case "left":
      return <AlignLeftIcon className={className} />;
    case "center":
      return <AlignCenterIcon className={className} />;
    case "right":
      return <AlignRightIcon className={className} />;
    case "justify":
      return <AlignJustifyIcon className={className} />;
    default:
      const _exhaustiveCheck: never = alignment;
      return _exhaustiveCheck;
  }
}

function getAlignmentLabel(alignment: AlignmentType) {
  switch (alignment) {
    case "left":
      return "Align left";
    case "center":
      return "Align center";
    case "right":
      return "Align right";
    case "justify":
      return "Justify";
    default:
      const _exhaustiveCheck: never = alignment;
      return _exhaustiveCheck;
  }
}
