"use client";

import { LogOutIcon } from "lucide-react";
import { AvatarWithFallback } from "./avatar-with-fallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function ProfileDropdown({
  name,
  email,
  photoUrl,
  className,
}: {
  name: string;
  email: string;
  photoUrl: string;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarWithFallback src={photoUrl} className={className} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup className="p-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-muted-foreground line-clamp-1 text-xs">{email}</p>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => authClient.signOut()}>
            <LogOutIcon />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
