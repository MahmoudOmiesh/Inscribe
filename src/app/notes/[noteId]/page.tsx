import { NoteWrapper } from "./_components/note-wrapper";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;

  return <NoteWrapper noteId={noteId} />;
}

//TODO:
// -- pagination?
