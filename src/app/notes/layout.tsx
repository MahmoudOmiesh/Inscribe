import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NotesSidebar } from "./_components/notes-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <SidebarProvider>
        <NotesSidebar />
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
