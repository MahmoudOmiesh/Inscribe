import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

export function AvatarWithFallback({ src }: { src: string }) {
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>
        <UserIcon className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}
