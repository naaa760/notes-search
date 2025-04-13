import { useAuth } from "@clerk/nextjs";
import { Note } from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://notes-search-delta.vercel.app";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export function useApi() {
  const { getToken } = useAuth();

  const fetchWithAuth = async (
    endpoint: string,
    options: FetchOptions = {}
  ) => {
    const token = await getToken();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  };

  return {
    notes: {
      getAll: () => fetchWithAuth("/api/notes"),
      create: (note: Omit<Note, "id">) =>
        fetchWithAuth("/api/notes", {
          method: "POST",
          body: JSON.stringify(note),
        }),
      update: (id: string, note: Omit<Note, "id">) =>
        fetchWithAuth(`/api/notes/${id}`, {
          method: "PUT",
          body: JSON.stringify(note),
        }),
      delete: (id: string) =>
        fetchWithAuth(`/api/notes/${id}`, { method: "DELETE" }),
      summarize: (content: string) =>
        fetchWithAuth("/api/notes/summarize", {
          method: "POST",
          body: JSON.stringify({ content }),
        }),
    },
  };
}
