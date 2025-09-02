import { Logo } from "@/components/logo";
import { SidebarHeader } from "@/components/ui/sidebar";
import Link from "next/link";

export function NotesSidebarHeader() {
  return (
    <SidebarHeader className="flex flex-row items-center justify-between px-4 pt-4">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="hidden text-xl font-bold sm:block">Inscribe</span>
      </Link>
    </SidebarHeader>
  );
}
