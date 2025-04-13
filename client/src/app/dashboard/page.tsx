"use client";

import { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import NoteList from "@/components/NoteList";
import NoteEditor from "@/components/NoteEditor";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import { Note } from "@/types";
import { useApi } from "@/utils/api";

export default function Dashboard() {
  const api = useApi();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await api.notes.getAll();
        setNotes(data);
        setFilteredNotes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setIsLoading(false);
      }
    };

    fetchNotes();
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

  const handleCreateNote = async (note: Omit<Note, "id">) => {
    try {
      const newNote = await api.notes.create(note);
      setNotes((prev) => [...prev, newNote]);
      setSelectedNote(null);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleUpdateNote = async (note: Note) => {
    try {
      const updatedNote = await api.notes.update(note.id, note);
      setNotes((prev) => prev.map((n) => (n.id === note.id ? updatedNote : n)));
      setSelectedNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.notes.delete(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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
