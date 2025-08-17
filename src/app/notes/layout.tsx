import { SidebarProvider } from "@/components/ui/sidebar";
import { NotesSidebar } from "./_components/notes-sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      <SidebarProvider>
        <NotesSidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarProvider>
    </main>
  );
}
