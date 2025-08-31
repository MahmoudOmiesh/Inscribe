import { SidebarProvider } from "@/components/ui/sidebar";
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
    redirect("/");
  }

  return (
    <main className="flex-1">
      <SidebarProvider>
        <UserProvider userId={session.user.id}>
          <SyncHandler>
            <NotesSidebar />
            <div className="flex flex-1 flex-col">{children}</div>
          </SyncHandler>
        </UserProvider>
      </SidebarProvider>
    </main>
  );
}
