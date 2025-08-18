import { api, HydrateClient } from "@/trpc/server";
import { ErrorSuspenseBoundary } from "@/components/error-suspense-boundary";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { tryCatch } from "@/lib/try-catch";
import { NoteWrapper } from "./_components/note-wrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const { data: note, error } = await tryCatch(
    api.note.get({ noteId: Number(noteId) }),
  );

  if (error) {
    return {
      title: "Inscribe",
    };
  }

  return {
    title: note.title,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  void api.note.get.prefetch({ noteId: Number(noteId) });

  return (
    <HydrateClient>
      <ErrorSuspenseBoundary
        suspenseFallback={<SuspenseFallback />}
        errorFallback={<ErrorFallback />}
      >
        <NoteWrapper noteId={Number(noteId)} />
      </ErrorSuspenseBoundary>
    </HydrateClient>
  );
}

function ErrorFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold">This note could not be found</h3>
        <p className="text-muted-foreground text-sm">
          Make sure you are using the correct link.
        </p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/notes">Go back</Link>
        </Button>
      </div>
    </div>
  );
}

function SuspenseFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
