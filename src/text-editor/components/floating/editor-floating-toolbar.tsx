import { FloatingToolbar } from "@/components/floating-toolbar";
import type { useEditorActions } from "../../hooks/use-editor-actions";
import {
  ALIGNMENT_TYPES,
  TEXT_BLOCK_TYPES,
  type ActiveMarkDescriptor,
  type Alignment,
  HIGHLIGHT_COLORS,
  type HighlightColor,
  type BlockType,
  type MarkType,
} from "../../model/schema";
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
} from "../utils";
import {
  Popover,
  PopoverContent,
  PopoverGroup,
  PopoverItem,
  PopoverLabel,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();

  const { markTypesSet, activeHighlightColor } = useMemo(() => {
    const types = new Set<ActiveMarkDescriptor["type"]>();
    let highlightColor: HighlightColor | null = null;

    for (const mark of active.marks) {
      types.add(mark.type);
      if (mark.type === "highlight") highlightColor = mark.color;
    }

    return { markTypesSet: types, activeHighlightColor: highlightColor };
  }, [active.marks]);

  return (
    <FloatingToolbar containerRef={editorRef}>
      <div
        className={cn(
          "bg-background flex items-center gap-2 rounded-sm border px-1 py-px",
          isMobile &&
            "w-screen overflow-x-scroll rounded-none border-0 border-t px-4",
        )}
      >
        {!isMobile && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  {active.block ? renderBlockLabel(active.block) : "Text"}
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
                  {TEXT_BLOCK_TYPES.map((block) => (
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
          </>
        )}

        <div className="flex items-center gap-1">
          <EditorToggle
            operation={() => actions.toggleMark({ type: "bold" })}
            isActive={markTypesSet.has("bold")}
            tooltip="Bold"
          >
            <BoldIcon />
          </EditorToggle>
          <EditorToggle
            operation={() => actions.toggleMark({ type: "italic" })}
            isActive={markTypesSet.has("italic")}
            tooltip="Italic"
          >
            <ItalicIcon />
          </EditorToggle>
          <EditorToggle
            operation={() => actions.toggleMark({ type: "underline" })}
            isActive={markTypesSet.has("underline")}
            tooltip="Underline"
          >
            <UnderlineIcon />
          </EditorToggle>
          <EditorToggle
            operation={() => actions.toggleMark({ type: "code" })}
            isActive={markTypesSet.has("code")}
            tooltip="Code"
          >
            <CodeIcon />
          </EditorToggle>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        {isMobile ? (
          <div className="flex items-center gap-1">
            <HighlightColors
              actions={actions}
              activeHighlightColor={activeHighlightColor}
            />
          </div>
        ) : (
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
                <HighlightColors
                  actions={actions}
                  activeHighlightColor={activeHighlightColor}
                />
              </PopoverGroup>
            </PopoverContent>
          </Popover>
        )}

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />

        {isMobile ? (
          <>
            <div className="flex items-center gap-1">
              <MoreMarks actions={actions} markTypesSet={markTypesSet} />
            </div>

            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />

            <div className="flex items-center gap-1">
              <Alignments actions={actions} activeAlignment={active.align} />
            </div>
          </>
        ) : (
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
                <MoreMarks actions={actions} markTypesSet={markTypesSet} />
              </PopoverGroup>

              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />

              <PopoverGroup className="flex-row items-center gap-1">
                <Alignments actions={actions} activeAlignment={active.align} />
              </PopoverGroup>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </FloatingToolbar>
  );
}

function HighlightColors({
  actions,
  activeHighlightColor,
}: {
  actions: ReturnType<typeof useEditorActions>;
  activeHighlightColor: HighlightColor | null;
}) {
  return (
    <>
      {HIGHLIGHT_COLORS.map((color) => (
        <EditorToggle
          key={color}
          operation={() => actions.toggleMark({ type: "highlight", color })}
          isActive={activeHighlightColor === color}
          tooltip={renderHighlightLabel(color)}
        >
          {renderHighlightColor(color)}
        </EditorToggle>
      ))}
    </>
  );
}

function Alignments({
  actions,
  activeAlignment,
}: {
  actions: ReturnType<typeof useEditorActions>;
  activeAlignment: Alignment | null;
}) {
  return (
    <>
      {ALIGNMENT_TYPES.map((alignment) => (
        <EditorToggle
          key={alignment}
          operation={() => actions.toggleBlockAlignment(alignment)}
          isActive={activeAlignment === alignment}
          tooltip={renderAlignmentLabel(alignment)}
        >
          {renderAlignmentIcon(alignment)}
        </EditorToggle>
      ))}
    </>
  );
}

function MoreMarks({
  actions,
  markTypesSet,
}: {
  actions: ReturnType<typeof useEditorActions>;
  markTypesSet: Set<MarkType>;
}) {
  return (
    <>
      <EditorToggle
        operation={() => actions.toggleMark({ type: "strikethrough" })}
        isActive={markTypesSet.has("strikethrough")}
        tooltip="Strikethrough"
      >
        <StrikethroughIcon />
      </EditorToggle>
      <EditorToggle
        operation={() => actions.toggleMark({ type: "superscript" })}
        isActive={markTypesSet.has("superscript")}
        tooltip="Superscript"
      >
        <SuperscriptIcon />
      </EditorToggle>
      <EditorToggle
        operation={() => actions.toggleMark({ type: "subscript" })}
        isActive={markTypesSet.has("subscript")}
        tooltip="Subscript"
      >
        <SubscriptIcon />
      </EditorToggle>
    </>
  );
}
