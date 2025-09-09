import { NoteContent } from "./_components/body/note-content";
import { NoteBanner } from "./_components/header/note-banner";
import { NoteHeader } from "./_components/header/note-header";

export default async function NotePage() {
  return (
    <>
      <div className="sticky top-0 z-10">
        <NoteHeader />
        <NoteBanner />
      </div>
      <NoteContent />
    </>
  );
}

//TODO:
// -- pagination?
