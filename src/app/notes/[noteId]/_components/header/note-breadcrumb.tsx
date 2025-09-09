import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArchiveIcon, Trash2Icon } from "lucide-react";
import { useNoteEditor } from "../note-editor-context";

export function NoteBreadcrumb() {
  const { note } = useNoteEditor();

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
                {note.folderEmoji} {note.folderName}
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
