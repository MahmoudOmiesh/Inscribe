import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function NoteEmptyState() {
  return (
    <SidebarMenuItem className="py-2 text-center">
      <p className="text-muted-foreground text-sm">This folder is empty</p>
    </SidebarMenuItem>
  );
}

export function NoteLoadingState() {
  return (
    <div className="space-y-1 px-1 py-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <SidebarMenuButton asChild>
            <Skeleton className="h-6 w-full cursor-default" />
          </SidebarMenuButton>
        </div>
      ))}
    </div>
  );
}
