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
import { resetLocalDB } from "@/local/db";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
          <DropdownMenuItem
            onClick={async () => {
              await Promise.all([
                authClient.signOut(),
                resetLocalDB(),
                router.push("/"),
              ]);
            }}
          >
            <LogOutIcon />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
