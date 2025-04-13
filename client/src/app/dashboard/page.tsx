"use client";

import { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import NoteList from "@/components/NoteList";
import NoteEditor from "@/components/NoteEditor";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import { Note } from "@/types";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for development
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: "1",
        title: "Welcome to Notes App",
        content:
          "This is a sample note to get you started. You can create, edit, and delete notes.",
        tags: ["welcome", "sample"],
        summary: "An introduction to the Notes App.",
      },
      {
        id: "2",
        title: "How to use tags",
        content:
          "Tags help you organize your notes. Add tags to your notes and filter by them.",
        tags: ["tutorial", "tags"],
        summary: "Learn how to use tags effectively.",
      },
      {
        id: "3",
        title: "Search functionality",
        content:
          "You can search through your notes by title or content. Just type in the search box.",
        tags: ["tutorial", "search"],
        summary: "How to search through your notes.",
      },
    ];

    setNotes(mockNotes);
    setFilteredNotes(mockNotes);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Extract all unique tags from notes
    const tags = notes
      .flatMap((note) => note.tags)
      .filter((tag, index, self) => tag && self.indexOf(tag) === index);
    setAllTags(tags);
  }, [notes]);

  useEffect(() => {
    filterNotes();
  }, [searchQuery, selectedTags, notes]);

  const filterNotes = () => {
    let filtered = [...notes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags.includes(tag))
      );
    }

    setFilteredNotes(filtered);
  };

  const handleCreateNote = (note: Omit<Note, "id">) => {
    // In a real app, this would be an API call
    const newNote = {
      ...note,
      id: Date.now().toString(),
    };

    setNotes((prev) => [...prev, newNote]);
    setSelectedNote(null);
  };

  const handleUpdateNote = (note: Note) => {
    // In a real app, this would be an API call
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
    setSelectedNote(null);
  };

  const handleDeleteNote = (id: string) => {
    // In a real app, this would be an API call
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setSelectedNote({ id: "", title: "", content: "", tags: [] })
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              New Note
            </button>
            <SignOutButton>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 space-y-4">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <TagFilter
              allTags={allTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
            <NoteList
              notes={filteredNotes}
              onSelectNote={setSelectedNote}
              onDeleteNote={handleDeleteNote}
              isLoading={isLoading}
            />
          </div>

          <div className="w-full md:w-2/3">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onSave={selectedNote.id ? handleUpdateNote : handleCreateNote}
                onCancel={() => setSelectedNote(null)}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md h-96 flex items-center justify-center text-gray-500">
                Select a note or create a new one
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
