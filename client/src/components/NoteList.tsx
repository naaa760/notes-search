import { Note } from "@/types";
import NoteCard from "./NoteCard";

interface NoteListProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  isLoading: boolean;
}

export default function NoteList({
  notes,
  onSelectNote,
  onDeleteNote,
  isLoading,
}: NoteListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No notes found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onSelect={onSelectNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}
