import { NoteEditor } from "./_components/note-editor";

export default async function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <NoteEditor />
    </div>
  );
}
