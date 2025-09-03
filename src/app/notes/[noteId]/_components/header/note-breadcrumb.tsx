import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocalFolder } from "@/local/queries/folders";
import { ArchiveIcon, Trash2Icon } from "lucide-react";
import { useNoteEditor } from "../note-editor-context";

export function NoteBreadcrumb() {
  const { note } = useNoteEditor();
  const folder = useLocalFolder(note.folderId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="line-clamp-1 hidden sm:block">
          <span className="flex items-center gap-1">
            {note.isTrashed ? (
              <>
                <Trash2Icon size={16} />
                Trash
              </>
            ) : note.isArchived ? (
              <>
                <ArchiveIcon size={16} />
                Archive
              </>
            ) : (
              <>
                {folder?.emoji} {folder?.name}
              </>
            )}
          </span>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:block" />
        <BreadcrumbItem className="line-clamp-1">{note.title}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
