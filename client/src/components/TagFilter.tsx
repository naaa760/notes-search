interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function TagFilter({
  allTags,
  selectedTags,
  setSelectedTags,
}: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Tags</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
