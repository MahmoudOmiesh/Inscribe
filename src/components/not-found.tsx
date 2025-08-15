import { Button } from "@/components/ui/button";
import { CircleXIcon } from "lucide-react";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <CircleXIcon className="text-destructive size-20" />
      <h1 className="text-2xl font-bold">Couldn&apos;t find this page</h1>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
