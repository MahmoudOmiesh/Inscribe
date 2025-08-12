import { NoteEditor } from "@/text-editor/note-editor";

export default function Home() {
  return (
    <div className="grid flex-1 place-items-center">
      <div className="w-full max-w-2xl">
        <NoteEditor />
      </div>
    </div>
  );
}
