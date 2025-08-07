"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarWithFallback } from "@/components/avatar-with-fallback";
import { authClient } from "@/lib/auth-client";
import { ChevronDown, LogOutIcon } from "lucide-react";

type NotesSidebarHeaderProps =
  | {
      isAnonymous: true;
    }
  | {
      isAnonymous: false;
      name: string;
      email: string;
      photoUrl: string;
    };

export function NotesSidebarHeader(props: NotesSidebarHeaderProps) {
  const name = props.isAnonymous ? "Anonymous" : props.name;
  const email = props.isAnonymous ? "anonymous@example.com" : props.email;
  const photoUrl = props.isAnonymous ? "" : props.photoUrl;

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <div className="flex items-center gap-2">
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="font-bold" size="lg">
                  <AvatarWithFallback src={photoUrl} className="size-6" />
                  <span>
                    {name}
                    {"'"}s Notes
                  </span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <SidebarTrigger />
            </div>

            <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
              <DropdownMenuGroup className="p-1">
                <p className="text-sm font-medium">{name}</p>
                <p className="text-muted-foreground line-clamp-1 text-xs">
                  {email}
                </p>
              </DropdownMenuGroup>
              {!props.isAnonymous && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => authClient.signOut()}>
                      <LogOutIcon />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
