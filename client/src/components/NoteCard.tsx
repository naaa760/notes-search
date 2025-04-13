import { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onSelect, onDelete }: NoteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <button onClick={() => onSelect(note)} className="text-left flex-1">
          <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
          <p className="text-sm text-gray-500 truncate mt-1">{note.content}</p>
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="ml-2 text-red-500 hover:text-red-700"
          aria-label="Delete note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
