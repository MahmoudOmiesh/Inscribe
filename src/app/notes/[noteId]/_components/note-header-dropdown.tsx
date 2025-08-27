import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  CornerUpRightIcon,
  CopyIcon,
  LinkIcon,
  MoreVerticalIcon,
  Trash2Icon,
  AArrowDown,
  Maximize2Icon,
  LockKeyholeOpenIcon,
  Undo2Icon,
  Redo2Icon,
  ArrowRightFromLineIcon,
  SearchIcon,
  ArchiveIcon,
  CornerUpLeftIcon,
} from "lucide-react";
import { useNoteEditor } from "./note-editor-context";
import {
  EXPORT_FORMATS,
  FONT_TYPES,
  type ExportFormat,
  type FontType,
} from "@/text-editor/model/schema";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToMarkdown } from "@/text-editor/export/md";
import { exportToHtml } from "@/text-editor/export/html";
import { useMutation } from "@tanstack/react-query";
import {
  updateLocalNoteArchive,
  updateLocalNoteFolder,
  updateLocalNoteFont,
  updateLocalNoteFullWidth,
  updateLocalNoteLocked,
  updateLocalNoteSmallText,
  updateLocalNoteTrash,
} from "@/local/mutations/notes";
import { useLocalFolders } from "@/local/queries/folders";
import { useUserId } from "../../_components/user-context";

export function NoteHeaderDropdown() {
  const { note, editor } = useNoteEditor();
  const userId = useUserId();

  const updateTrash = useMutation({
    mutationFn: (isTrashed: boolean) =>
      updateLocalNoteTrash({
        noteId: note.id,
        userId,
        data: { isTrashed },
      }),
    meta: {
      toastOnError: "Failed to move to trash, please try again.",
    },
  });

  const updateArchive = useMutation({
    mutationFn: (isArchived: boolean) =>
      updateLocalNoteArchive({
        noteId: note.id,
        userId,
        data: { isArchived },
      }),
    meta: {
      toastOnError: "Failed to archive, please try again.",
    },
  });

  const updateFont = useMutation({
    mutationFn: (font: FontType) =>
      updateLocalNoteFont({ noteId: note.id, userId, data: { font } }),
    meta: {
      toastOnError: "Failed to update font, please try again.",
    },
  });

  const updateSmallText = useMutation({
    mutationFn: (smallText: boolean) =>
      updateLocalNoteSmallText({
        noteId: note.id,
        userId,
        data: { smallText },
      }),
    meta: {
      toastOnError: "Failed to update small text, please try again.",
    },
  });

  const updateLocked = useMutation({
    mutationFn: (locked: boolean) =>
      updateLocalNoteLocked({ noteId: note.id, userId, data: { locked } }),
    meta: {
      toastOnError: "Failed to update locked, please try again.",
    },
  });

  const updateFullWidth = useMutation({
    mutationFn: (fullWidth: boolean) =>
      updateLocalNoteFullWidth({
        noteId: note.id,
        userId,
        data: { fullWidth },
      }),
    meta: {
      toastOnError: "Failed to update full width, please try again.",
    },
  });

  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const canUndoOrRedo = editor.canUndo || editor.canRedo;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="shadow-sm">
          {note.isTrashed ? (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => updateTrash.mutate(false)}>
                  <Trash2Icon /> Restore from trash
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                  <ArrowRightFromLineIcon className="-rotate-90" /> Export
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : (
            <>
              <DropdownMenuGroup className="grid grid-cols-3 gap-2">
                {FONT_TYPES.map((font) => (
                  <DropdownMenuItem
                    key={font}
                    className="flex flex-col items-center gap-0"
                    variant={note.font === font ? "primary" : "default"}
                    onClick={(e) => {
                      e.preventDefault();
                      updateFont.mutate(font);
                    }}
                  >
                    <span className="text-xl font-semibold">Aa</span>
                    <span className="text-xs">{font}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                >
                  <LinkIcon /> Copy link
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon /> Duplicate
                </DropdownMenuItem>
                {note.isArchived ? (
                  <DropdownMenuItem onClick={() => updateArchive.mutate(false)}>
                    <CornerUpLeftIcon /> Unarchive
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center gap-2">
                      <CornerUpRightIcon className="text-muted-foreground size-4" />{" "}
                      Move to
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent sideOffset={10}>
                        <MoveToDropdown
                          moveToArchive={() => updateArchive.mutate(true)}
                          moveToTrash={() => updateTrash.mutate(true)}
                        />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    updateSmallText.mutate(!note.smallText);
                  }}
                >
                  <AArrowDown /> Small text{" "}
                  <Switch
                    id="small-text"
                    className="pointer-events-none ml-auto"
                    checked={note.smallText}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    updateFullWidth.mutate(!note.fullWidth);
                  }}
                >
                  <Maximize2Icon className="rotate-45" /> Full width{" "}
                  <Switch
                    id="full-width"
                    className="pointer-events-none ml-auto"
                    checked={note.fullWidth}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    updateLocked.mutate(!note.locked);
                  }}
                >
                  <LockKeyholeOpenIcon /> Lock page{" "}
                  <Switch
                    id="lock-page"
                    className="pointer-events-none ml-auto"
                    checked={note.locked}
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {canUndoOrRedo && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {editor.canUndo && (
                      <DropdownMenuItem onClick={() => editor.undo()}>
                        <Undo2Icon /> Undo
                      </DropdownMenuItem>
                    )}
                    {editor.canRedo && (
                      <DropdownMenuItem onClick={() => editor.redo()}>
                        <Redo2Icon /> Redo
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                  <ArrowRightFromLineIcon className="-rotate-90" /> Export
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ExportDialog
        isOpen={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </>
  );
}

function ExportDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { editor, note } = useNoteEditor();
  const [exportFormat, setExportFormat] = useState<ExportFormat>("html");

  function handleExport() {
    switch (exportFormat) {
      case "html": {
        const html = exportToHtml(editor.state.nodes, {
          title: note.title,
          smallText: note.smallText,
          font: note.font,
        });
        const blob = new Blob([html], { type: "text/html" });
        downloadFile(blob, `${note.title}-${note.id}-export.html`);
        break;
      }
      case "markdown": {
        const markdown = exportToMarkdown(editor.state.nodes);
        const blob = new Blob([markdown], { type: "text/markdown" });
        downloadFile(blob, `${note.title}-${note.id}-export.${exportFormat}`);
        break;
      }
      default:
        const _: never = exportFormat;
        return _;
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground flex-1 text-sm">
            Export format
          </span>
          <Select
            value={exportFormat}
            onValueChange={(value) => setExportFormat(value as ExportFormat)}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {EXPORT_FORMATS.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="mt-3">
          <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleExport}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function MoveToDropdown({
  moveToArchive,
  moveToTrash,
}: {
  moveToArchive: () => void;
  moveToTrash: () => void;
}) {
  const [search, setSearch] = useState("");
  const folders = useLocalFolders();
  const { note } = useNoteEditor();
  const userId = useUserId();

  const updateFolder = useMutation({
    mutationFn: (folderId: string) =>
      updateLocalNoteFolder({
        noteId: note.id,
        userId,
        data: { folderId },
      }),
    meta: {
      toastOnError: "Failed to update folder, please try again.",
    },
  });

  const filteredFolders =
    folders?.filter((folder) =>
      folder.name.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  const isPending = folders === undefined;

  return (
    <div>
      <DropdownMenuGroup>
        <div className="focus-within:ring-ring focus-within:border-primary flex cursor-text items-center gap-2 rounded-sm border p-1">
          <SearchIcon className="text-muted-foreground size-4" />
          <Input
            placeholder="Move to..."
            className="h-fit rounded-none border-none bg-transparent p-0 text-xs shadow-none placeholder:text-xs focus-visible:shadow-none focus-visible:ring-0 dark:bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </DropdownMenuGroup>
      <DropdownMenuGroup className="mt-2">
        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <>
            {filteredFolders.map((folder) => (
              <DropdownMenuItem
                key={folder.id}
                onClick={() => updateFolder.mutate(folder.id)}
              >
                {folder.emoji} {folder.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={moveToArchive}>
              <ArchiveIcon /> archive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={moveToTrash}>
              <Trash2Icon /> trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuGroup>
    </div>
  );
}
