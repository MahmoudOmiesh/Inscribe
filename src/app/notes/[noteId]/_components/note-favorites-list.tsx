"use client";

import { Spinner } from "@/components/spinner";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalNoteFavorites } from "@/local/queries/notes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NoteFavoritesList() {
  const favorites = useLocalNoteFavorites();
  const pathname = usePathname();

  if (!favorites) {
    return (
      <div className="flex h-16 items-center justify-center p-2">
        <Spinner />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center p-2">
        <p className="text-muted-foreground text-center text-sm italic">
          No favorites found.
        </p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {favorites.map((favorite) => (
        <SidebarMenuItem key={favorite.id}>
          <SidebarMenuButton
            asChild
            isActive={pathname === `/notes/${favorite.id}`}
          >
            <Link href={`/notes/${favorite.id}`}>{favorite.title}</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
