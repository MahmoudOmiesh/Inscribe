import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NotesSidebar } from "./_components/notes-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "./_components/user-context";
import { SyncHandler } from "./_components/sync-handler";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth?callbackURL=notes");
  }

  return (
    <main className="flex-1">
      <SidebarProvider>
        <UserProvider userId={session.user.id}>
          <SyncHandler>
            <NotesSidebar />
            <div className="relative flex flex-1 flex-col">
              <SidebarTrigger className="bg-muted absolute top-0 left-4 z-12 mt-3.5 size-8 sm:mt-2.5" />
              {children}
            </div>
          </SyncHandler>
        </UserProvider>
      </SidebarProvider>
    </main>
  );
}
