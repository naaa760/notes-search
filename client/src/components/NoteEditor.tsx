import { useState, useEffect } from "react";
import { Note } from "@/types";

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export default function NoteEditor({
  note,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [summary, setSummary] = useState(note.summary || "");

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setSummary(note.summary || "");
  }, [note]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    onSave({
      ...note,
      title: title.trim(),
      content: content.trim(),
      tags,
      summary: summary.trim(),
    });
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Note title"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write your note here..."
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags
        </label>
        <div className="flex">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Summary
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Note summary"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
