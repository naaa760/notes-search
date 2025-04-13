import { useAuth } from "@clerk/nextjs";
import { Note } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
    try {
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
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
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
