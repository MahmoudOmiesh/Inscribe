import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerGroup,
  DrawerGroupItem,
  DrawerGroupItemButton,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  EXPORT_FORMATS,
  FONT_TYPES,
  type ExportFormat,
} from "@/text-editor/model/schema";
import {
  AArrowDown,
  ArchiveIcon,
  ArrowRightFromLineIcon,
  CheckIcon,
  CopyIcon,
  CornerUpLeftIcon,
  CornerUpRightIcon,
  LinkIcon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  Maximize2Icon,
  MoreHorizontalIcon,
  Redo2Icon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import { exportNote, NOTE_MUTATIONS } from "../../mutations";
import { useNoteEditor } from "../note-editor-context";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocalFolders } from "@/local/queries/folders";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function NoteHeaderDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMoveToDrawerOpen, setIsMoveToDrawerOpen] = useState(false);
  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);

  const { note, editor } = useNoteEditor();

  const updateFont = NOTE_MUTATIONS.updateFont(note.id);
  const updateArchive = NOTE_MUTATIONS.updateArchive(note.id);
  const updateTrash = NOTE_MUTATIONS.updateTrash(note.id);
  const updateFavorite = NOTE_MUTATIONS.updateFavorite(note.id);
  const updateSmallText = NOTE_MUTATIONS.updateSmallText(note.id);
  const updateLocked = NOTE_MUTATIONS.updateLocked(note.id);
  const updateFullWidth = NOTE_MUTATIONS.updateFullWidth(note.id);
  const copyNoteLink = NOTE_MUTATIONS.copyNoteLink(note.id);

  const canUndoOrRedo = editor.canUndo || editor.canRedo;

  function openDrawer(drawer: "moveTo" | "export") {
    if (drawer === "moveTo") {
      setIsMoveToDrawerOpen(true);
    } else if (drawer === "export") {
      setIsExportDrawerOpen(true);
    }
    setIsDrawerOpen(false);
  }

  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="text-muted-foreground" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[95vh] min-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Actions</DrawerTitle>
          </DrawerHeader>

          <ScrollArea className="max-h-[75vh] space-y-6 overflow-auto p-4 pr-2.5">
            {note.isTrashed ? (
              <DrawerGroup>
                <DrawerGroupItem>
                  <DrawerGroupItemButton
                    onClick={() => {
                      updateTrash.mutate(false);
                      setIsDrawerOpen(false);
                    }}
                  >
                    <Trash2Icon /> Restore from trash
                  </DrawerGroupItemButton>
                </DrawerGroupItem>
                <DrawerGroupItem>
                  <DrawerGroupItemButton onClick={() => openDrawer("export")}>
                    <ArrowRightFromLineIcon className="-rotate-90" /> Export
                  </DrawerGroupItemButton>
                </DrawerGroupItem>
              </DrawerGroup>
            ) : (
              <>
                <DrawerGroup className="grid grid-cols-3">
                  {FONT_TYPES.map((font) => (
                    <DrawerGroupItem key={font}>
                      <DrawerGroupItemButton
                        className="flex-col items-center gap-0 rounded-md"
                        variant={note.font === font ? "default" : "ghost"}
                        onClick={(e) => {
                          e.preventDefault();
                          updateFont.mutate(font);
                        }}
                      >
                        <span className="text-xl font-semibold">Aa</span>
                        <span className="text-xs">{font}</span>
                      </DrawerGroupItemButton>
                    </DrawerGroupItem>
                  ))}
                </DrawerGroup>

                <DrawerGroup>
                  <DrawerGroupItem>
                    <DrawerGroupItemButton
                      onClick={() => {
                        updateFavorite.mutate(!note.isFavorite);
                        setIsDrawerOpen(false);
                      }}
                    >
                      <StarIcon
                        className={cn(
                          note.isFavorite && "fill-yellow-500 text-yellow-500",
                        )}
                      />{" "}
                      {note.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </DrawerGroupItemButton>
                  </DrawerGroupItem>
                  <DrawerGroupItem>
                    <DrawerGroupItemButton
                      onClick={() => {
                        copyNoteLink.mutate();
                        setIsDrawerOpen(false);
                      }}
                    >
                      <LinkIcon /> Copy link
                    </DrawerGroupItemButton>
                  </DrawerGroupItem>
                  <DrawerGroupItem>
                    <DrawerGroupItemButton>
                      <CopyIcon /> Duplicate
                    </DrawerGroupItemButton>
                  </DrawerGroupItem>
                  {note.isArchived ? (
                    <DrawerGroupItem>
                      <DrawerGroupItemButton
                        onClick={() => {
                          updateArchive.mutate(false);
                          setIsDrawerOpen(false);
                        }}
                      >
                        <CornerUpLeftIcon /> Unarchive
                      </DrawerGroupItemButton>
                    </DrawerGroupItem>
                  ) : (
                    <DrawerGroupItem>
                      <DrawerGroupItemButton
                        onClick={() => openDrawer("moveTo")}
                      >
                        <CornerUpRightIcon /> Move to
                      </DrawerGroupItemButton>
                    </DrawerGroupItem>
                  )}
                </DrawerGroup>

                <DrawerGroup>
                  <DrawerGroupItem
                    onClick={() => updateSmallText.mutate(!note.smallText)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-fit w-full justify-start rounded-none py-3",
                    )}
                  >
                    <AArrowDown /> Small text
                    <Switch
                      id="small-text"
                      className="pointer-events-none ml-auto"
                      checked={note.smallText}
                    />
                  </DrawerGroupItem>
                  <DrawerGroupItem
                    onClick={() => updateFullWidth.mutate(!note.fullWidth)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-fit w-full justify-start rounded-none py-3",
                    )}
                  >
                    <Maximize2Icon /> Full width
                    <Switch
                      id="full-width"
                      className="pointer-events-none ml-auto"
                      checked={note.fullWidth}
                    />
                  </DrawerGroupItem>
                  <DrawerGroupItem
                    onClick={() => updateLocked.mutate(!note.locked)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-fit w-full justify-start rounded-none py-3",
                    )}
                  >
                    {note.locked ? (
                      <LockKeyholeOpenIcon />
                    ) : (
                      <LockKeyholeIcon />
                    )}
                    Lock page
                    <Switch
                      id="lock-page"
                      className="pointer-events-none ml-auto"
                      checked={note.locked}
                    />
                  </DrawerGroupItem>
                </DrawerGroup>

                {canUndoOrRedo && (
                  <DrawerGroup>
                    {editor.canUndo && (
                      <DrawerGroupItem>
                        <DrawerGroupItemButton
                          onClick={() => {
                            editor.undo();
                            setIsDrawerOpen(false);
                          }}
                        >
                          <Undo2Icon /> Undo
                        </DrawerGroupItemButton>
                      </DrawerGroupItem>
                    )}
                    {editor.canRedo && (
                      <DrawerGroupItem>
                        <DrawerGroupItemButton
                          onClick={() => {
                            editor.redo();
                            setIsDrawerOpen(false);
                          }}
                        >
                          <Redo2Icon /> Redo
                        </DrawerGroupItemButton>
                      </DrawerGroupItem>
                    )}
                  </DrawerGroup>
                )}

                <DrawerGroup>
                  <DrawerGroupItem>
                    <DrawerGroupItemButton onClick={() => openDrawer("export")}>
                      <ArrowRightFromLineIcon className="-rotate-90" /> Export
                    </DrawerGroupItemButton>
                  </DrawerGroupItem>
                </DrawerGroup>
              </>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <MoveToDrawer
        isOpen={isMoveToDrawerOpen}
        onOpenChange={setIsMoveToDrawerOpen}
      />

      <ExportDrawer
        isOpen={isExportDrawerOpen}
        onOpenChange={setIsExportDrawerOpen}
      />
    </>
  );
}

function MoveToDrawer({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { note } = useNoteEditor();
  const [search, setSearch] = useState("");
  const folders = useLocalFolders();

  const updateFolder = NOTE_MUTATIONS.updateFolder(note.id);
  const updateArchive = NOTE_MUTATIONS.updateArchive(note.id);
  const updateTrash = NOTE_MUTATIONS.updateTrash(note.id);

  const filteredFolders =
    folders?.filter((folder) =>
      folder.name.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const isPending = folders === undefined;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] min-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Move to</DrawerTitle>
          <div className="focus-within:ring-ring focus-within:border-primary bg-muted mt-4 flex cursor-text items-center gap-2 rounded-sm border p-2">
            <SearchIcon className="text-muted-foreground size-4" />
            <Input
              placeholder="Move to..."
              className="h-fit rounded-none border-none bg-transparent p-0 text-sm shadow-none placeholder:text-sm focus-visible:shadow-none focus-visible:ring-0 dark:bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </DrawerHeader>
        <ScrollArea className="max-h-[75vh] space-y-6 overflow-auto p-4 pr-2.5">
          {isPending ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <DrawerGroup>
              {filteredFolders.map((folder) => (
                <DrawerGroupItem key={folder.id}>
                  <DrawerGroupItemButton
                    disabled={folder.id === note.folderId}
                    onClick={() => {
                      updateFolder.mutate(folder.id);
                      onOpenChange(false);
                    }}
                  >
                    {folder.emoji} {folder.name}
                    {folder.id === note.folderId && (
                      <CheckIcon className="ml-auto" />
                    )}
                  </DrawerGroupItemButton>
                </DrawerGroupItem>
              ))}
            </DrawerGroup>
          )}

          <DrawerGroup>
            <DrawerGroupItem>
              <DrawerGroupItemButton
                onClick={() => {
                  updateArchive.mutate(true);
                  onOpenChange(false);
                }}
              >
                <ArchiveIcon /> Move to archive
              </DrawerGroupItemButton>
            </DrawerGroupItem>
            <DrawerGroupItem>
              <DrawerGroupItemButton
                onClick={() => {
                  updateTrash.mutate(true);
                  onOpenChange(false);
                }}
              >
                <Trash2Icon /> Move to trash
              </DrawerGroupItemButton>
            </DrawerGroupItem>
          </DrawerGroup>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function ExportDrawer({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { note, editor } = useNoteEditor();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("html");

  function handleExport() {
    exportNote({
      note,
      format: exportFormat,
      editorNodes: editor.state.nodes,
    });
    onOpenChange(false);
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] min-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Export</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="max-h-[75vh] space-y-6 overflow-auto p-4 pr-2.5">
          <DrawerGroup>
            {EXPORT_FORMATS.map((format) => (
              <DrawerGroupItem key={format}>
                <DrawerGroupItemButton
                  onClick={() => setExportFormat(format)}
                  variant={exportFormat === format ? "secondary" : "ghost"}
                  className="capitalize"
                >
                  {format}
                  {exportFormat === format && <CheckIcon className="ml-auto" />}
                </DrawerGroupItemButton>
              </DrawerGroupItem>
            ))}
          </DrawerGroup>

          <div className="space-y-2">
            <Button className="w-full" onClick={handleExport}>
              Export
            </Button>
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
